import {
  $,
  Component,
  QwikIntrinsicElements,
  component$,
  noSerialize,
  useTask$,
} from "@builder.io/qwik";
import { resolveSchema } from "../models/schema/utils/resolvers";
import { toDataPathSegments } from "../models/schema/utils/path";
import { getAdditionalTemplate, getTemplate } from "../models/uiSchema/utils";
import { getInitialFieldStore } from "../utils/getInitialFieldStore";
import { inferUiSchemaSingle } from "../models/uiSchema";
import type { JSONSchema7, JSONSchema7Object } from "json-schema";
import type {
  ArrayLayout,
  ArrayTemplateProps,
  ArrayTemplates,
  ButtonTemplateProps,
  ControlTemplates,
  ControlWidgets,
  DefaultArrayItemTemplateProps,
  DefaultArrayTemplates,
  DefaultControlTemplates,
  DefaultControlWidgets,
  DefaultFieldTemplateProps,
  DefaultHorizontalTemplates,
  DefaultVerticalTemplates,
  FormStore,
  HorizontalTemplates,
  ResponseData,
  VerticalTemplates,
} from "../types";
import { AdditionalTemplateType } from "../types";
import { SchemaParser } from "./SchemaParser";

interface ArrayTemplateMakerProps<
  S,
  T,
  TResponseData extends ResponseData<T> = ResponseData<T>,
  V extends VerticalTemplates | DefaultVerticalTemplates =
    | VerticalTemplates
    | DefaultVerticalTemplates,
  H extends HorizontalTemplates | DefaultHorizontalTemplates =
    | HorizontalTemplates
    | DefaultHorizontalTemplates,
  A extends ArrayTemplates | DefaultArrayTemplates =
    | ArrayTemplates
    | DefaultArrayTemplates,
  C extends ControlTemplates | DefaultControlTemplates =
    | ControlTemplates
    | DefaultControlTemplates,
  W extends ControlWidgets | DefaultControlWidgets =
    | ControlWidgets
    | DefaultControlWidgets,
> {
  layout: ArrayLayout<V, H, A, C, W>;
  formData: FormStore<S, T, TResponseData>;
  overrideScope?: string;
  itemScope?: string;
}

function shiftAndDelete(obj: Record<string, any>, index: number, path: string) {
  const keys = Object.keys(obj);

  const deleteBeforeKeys: string[] = [];

  const filteredKeys = keys.filter((key) => {
    const keySplit = key.split(`${path}.`);
    keySplit.shift();
    const restKeys = keySplit.join(`${path}.`).split(".");
    if (parseInt(restKeys[0]) === index) {
      deleteBeforeKeys.push(key);
    }
    return key.startsWith(`${path}.`) && parseInt(restKeys[0]) > index;
  });

  let deleteAfterKeys: string[] = [];
  let lastInt: number | undefined = undefined;
  const newObj = keys.reduce((acc: any, key: any) => {
    if (filteredKeys.includes(key)) {
      const keySplit = key.split(`${path}.`);
      keySplit.shift();
      const restKeys = keySplit.join(`${path}.`).split(".");
      const firstRestKey = restKeys.shift();
      const newKey =
        `${path}.` +
        [(parseInt(firstRestKey) - 1).toString(), ...restKeys].join(".");
      acc[key] = newKey;
      if (!lastInt || lastInt < firstRestKey) {
        lastInt = firstRestKey;
        deleteAfterKeys = [];
      }
      if (lastInt === firstRestKey) {
        deleteAfterKeys.push(key);
      }
    }
    return acc;
  }, {});

  return { newObj, deleteBeforeKeys, deleteAfterKeys };
}

export const ArrayTemplateMaker = component$<ArrayTemplateMakerProps<any, any>>(
  ({ layout, formData, overrideScope, itemScope }) => {
    let layoutScope = layout.scope;
    let newOverrideScope = overrideScope;
    if (itemScope) {
      layoutScope = layoutScope.replace(/\{scope\}/g, itemScope);
      if (newOverrideScope) {
        newOverrideScope = layout.scope.replace(
          /\{scope\}\/?/g,
          newOverrideScope,
        );
      }
    }

    const subSchema = resolveSchema(
      formData.schema as JSONSchema7,
      newOverrideScope || layoutScope,
      formData.schema as JSONSchema7,
    );

    if (!subSchema) {
      return <>No Schema found for array.</>;
    }

    const dataPath = toDataPathSegments(layoutScope);

    const FormTemplate = getTemplate(
      layout.type,
      formData.uiSchema.templates,
      layout["ui:template"],
    ) as Component<ArrayTemplateProps>;

    const addItem = $(() => {
      const newItemPath = dataPath.join(".");
      if (!formData.internal.fields[newItemPath]) {
        formData.internal.fields[newItemPath] = getInitialFieldStore(
          dataPath.join("."),
        );
      }
      if (!formData.internal.fields[newItemPath]!.value) {
        formData.internal.fields[newItemPath]!.value = [];
      }
      formData.internal.fields[newItemPath]!.value.push(undefined);
    });

    const removeItem = $((i: number) => {
      const newItemPath = dataPath.join(".");

      const { newObj, deleteBeforeKeys, deleteAfterKeys } = shiftAndDelete(
        formData.internal.fields,
        i,
        newItemPath,
      );

      const safeKeys: string[] = [];
      Object.entries(newObj).forEach(([k, v]: any) => {
        if (formData.internal.fields[v]) {
          formData.internal.fields[v]!.value =
            formData.internal.fields[k]?.value;
        } else {
          formData.internal.fields[v] = formData.internal.fields[k];
          formData.internal.fields[v]!.name = v;
        }

        safeKeys.push(v);
      });

      deleteBeforeKeys
        .filter((v) => !safeKeys.includes(v))
        .forEach((v) => {
          delete formData.internal.fields[v];
        });

      if (deleteAfterKeys.length <= 0) {
        const path = [...dataPath, i].join(".");
        const keys = Object.keys(formData.internal.fields);

        keys.forEach((key) => {
          if (key.startsWith(`${path}`)) {
            delete formData.internal.fields[key];
          }
        });
      } else {
        deleteAfterKeys.forEach((v) => {
          delete formData.internal.fields[v];
        });
      }

      formData.internal.fields[newItemPath]?.value.splice(i, 1);
    });

    const testUniqueEnum =
      subSchema.uniqueItems &&
      subSchema.items &&
      typeof subSchema.items !== "boolean" &&
      !Array.isArray(subSchema.items)
        ? noSerialize(subSchema.items.enum)
        : undefined;

    const defaultSubSchema = subSchema.default as any[];

    useTask$(() => {
      if (!formData.internal.fields[dataPath.join(".")]) {
        formData.internal.fields[dataPath.join(".")] = getInitialFieldStore(
          dataPath.join("."),
          {
            value: defaultSubSchema,
            initialValue: [],
            error: [],
          },
        );
        for (let i = 0; i < (defaultSubSchema || []).length; i++) {
          formData.internal.fields[[...dataPath, i].join(".")] =
            getInitialFieldStore([...dataPath, i].join("."), {
              value: defaultSubSchema[i],
              initialValue: undefined,
              error: [],
            });
          formData.internal.fields[
            [...dataPath, i].join(".")
          ]!.internal.startValue = defaultSubSchema[i];
        }
        formData.internal.fields[[...dataPath].join(".")]!.internal.startValue =
          defaultSubSchema;
      }
      if (testUniqueEnum) {
        for (let i = 0; i < testUniqueEnum.length; i++) {
          formData.internal.fields[[...dataPath, i].join(".")] =
            getInitialFieldStore([...dataPath, i].join("."), {
              value: formData.internal.fields[
                dataPath.join(".")
              ]?.value.includes(testUniqueEnum[i])
                ? (testUniqueEnum[i] as any)
                : undefined,
              initialValue: formData.internal.fields[
                dataPath.join(".")
              ]?.value.includes(testUniqueEnum[i])
                ? (testUniqueEnum[i] as any)
                : undefined,
              error: [],
              isUniqueEnum: true,
            });
          formData.internal.fields[
            [...dataPath, i].join(".")
          ]!.internal.startValue = testUniqueEnum[i];
        }
        formData.internal.fields[dataPath.join(".")]!.value = undefined;
      }
    });

    const AddButtonTemplate = getAdditionalTemplate(
      AdditionalTemplateType.BUTTON,
      formData.uiSchema.templates,
      "addButton",
    ) as Component<ButtonTemplateProps & QwikIntrinsicElements["button"]>;

    const RemoveButtonTemplate = getAdditionalTemplate(
      AdditionalTemplateType.BUTTON,
      formData.uiSchema.templates,
      "removeButton",
    ) as Component<ButtonTemplateProps & QwikIntrinsicElements["button"]>;

    const ArrayItemTemplate = getAdditionalTemplate(
      AdditionalTemplateType.ARRAY_ITEM,
      formData.uiSchema.templates,
      "defaultArrayItem",
    ) as Component<
      DefaultArrayItemTemplateProps & QwikIntrinsicElements["div"]
    >;

    const TitleTemplate = getAdditionalTemplate(
      AdditionalTemplateType.FIELD,
      formData.uiSchema.templates,
      "defaultArrayTitle",
    ) as Component<DefaultFieldTemplateProps>;

    return (
      <>
        <FormTemplate
          layout={layout}
          subSchema={subSchema as JSONSchema7Object}
        >
          {layout["ui:title"] === false ? (
            <></>
          ) : (
            <TitleTemplate
              q:slot="title"
              layout={layout}
              subSchema={subSchema as JSONSchema7Object}
              required={!!subSchema.minItems}
            />
          )}
          {(
            testUniqueEnum ||
            formData.internal.fields[dataPath.join(".")]?.value ||
            []
          ).map((_item: any, i: number) => (
            <ArrayItemTemplate
              key={[...dataPath, i].join(".")}
              itemPath={[...dataPath, i].join(".")}
              layout={layout}
              subSchema={subSchema as JSONSchema7Object}
              isUniqueEnum={!!testUniqueEnum}
            >
              <SchemaParser
                layout={{
                  ...(layout["ui:items"] ||
                    inferUiSchemaSingle(
                      subSchema?.items,
                      layoutScope + `/items/${i}`,
                    )),
                }}
                itemScope={layoutScope + `/items/${i}`}
                overrideScope={(newOverrideScope || layoutScope) + `/items/`}
                templates={formData.uiSchema.templates}
                formData={formData}
              />
              {!testUniqueEnum ? (
                <RemoveButtonTemplate
                  q:slot="remove-button"
                  props={{
                    type: "button",
                    onClick$: $(() => removeItem(i)),
                    disabled: formData.disabled,
                  }}
                >
                  Remove
                </RemoveButtonTemplate>
              ) : (
                <></>
              )}
            </ArrayItemTemplate>
          ))}
          {!testUniqueEnum ? (
            <AddButtonTemplate
              q:slot="add-button"
              props={{
                type: "button",
                onClick$: addItem,
                disabled: formData.disabled,
              }}
            >
              Add
            </AddButtonTemplate>
          ) : (
            <></>
          )}
        </FormTemplate>
      </>
    );
  },
);
