import {
  $,
  Component,
  QwikIntrinsicElements,
  component$,
  noSerialize,
  useTask$,
} from "@builder.io/qwik";
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
  DefaultHorizontalTemplates,
  DefaultVerticalTemplates,
  FormStore,
  HorizontalTemplates,
  ResponseData,
  VerticalTemplates,
} from "../types";
import { AdditionalTemplateType } from "../types";
import { resolveSchema } from "../models/schema/utils/resolvers";
import { toDataPathSegments } from "../models/schema/utils/path";
import { getAdditionalTemplate, getTemplate } from "../models/uiSchema/utils";
import type { JSONSchema7, JSONSchema7Object } from "json-schema";
import { getInitialFieldStore } from "../utils/getInitialFieldStore";
import { SchemaParser } from "./SchemaParser";
import { inferUiSchemaSingle } from "../models/uiSchema";

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

  const filteredKeys = keys.filter(
    (key) =>
      key.startsWith(`${path}.`) && parseInt(key.split(`${path}.`)[1]) > index,
  );

  const newObj = keys.reduce((acc: any, key: any) => {
    if (filteredKeys.includes(key)) {
      const parts = key.split(`${path}.`);
      const newKey = `${path}.` + (parseInt(parts[1]) - 1).toString();
      acc[key] = newKey;
    }
    return acc;
  }, {});

  return { newObj };
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

      const { newObj } = shiftAndDelete(
        formData.internal.fields,
        i,
        newItemPath,
      );

      let lastKey;
      Object.entries(newObj).forEach(([k, v]: any) => {
        formData.internal.fields[v] = formData.internal.fields[k];
        formData.internal.fields[v]!.name = v;
        lastKey = k;
      });

      if (lastKey) {
        delete formData.internal.fields[lastKey];
      } else {
        delete formData.internal.fields[[...dataPath, i].join(".")];
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
      DefaultArrayItemTemplateProps & QwikIntrinsicElements["button"]
    >;

    return (
      <>
        <FormTemplate
          layout={layout}
          subSchema={subSchema as JSONSchema7Object}
        >
          {(
            testUniqueEnum ||
            formData.internal.fields[dataPath.join(".")]?.value ||
            []
          ).map((_item: any, i: number) => (
            <ArrayItemTemplate key={[...dataPath, i].join(".")}>
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
                  slot="remove-button"
                  props={{ type: "button", onClick$: $(() => removeItem(i)) }}
                >
                  Remove
                </RemoveButtonTemplate>
              ) : (
                <></>
              )}
            </ArrayItemTemplate>
          ))}
          {!testUniqueEnum ? (
            <AddButtonTemplate props={{ type: "button", onClick$: addItem }}>
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
