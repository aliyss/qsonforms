import { Component, component$, useTask$ } from "@builder.io/qwik";
import type {
  ControlElement,
  ControlTemplateProps,
  ControlTemplates,
  ControlWidgetProps,
  ControlWidgets,
  DefaultControlTemplates,
  DefaultControlWidgets,
  DefaultFieldTemplateProps,
  ErrorTemplateProps,
  FieldStore,
  FormStore,
  ResponseData,
} from "../types";
import { AdditionalTemplateType } from "../types";
import { resolveSchema } from "../models/schema/utils/resolvers";
import { toDataPathSegments } from "../models/schema/utils/path";
import {
  getAdditionalTemplate,
  getTemplate,
  getWidget,
} from "../models/uiSchema/utils";
import { Field, FieldElementProps } from "./Field";
import type { JSONSchema7Object } from "json-schema";
import { getInitialFieldStore } from "../utils/getInitialFieldStore";

interface ControlTemplateMakerProps<
  S,
  T,
  TResponseData extends ResponseData<T> = ResponseData<T>,
  C extends ControlTemplates | DefaultControlTemplates =
    | ControlTemplates
    | DefaultControlTemplates,
  W extends ControlWidgets | DefaultControlWidgets =
    | ControlWidgets
    | DefaultControlWidgets,
> {
  layout: ControlElement<C, W>;
  formData: FormStore<S, T, TResponseData>;
  overrideScope?: string;
  itemScope?: string;
}

export const ControlTemplateMaker = component$<
  ControlTemplateMakerProps<any, any>
>(({ layout, formData, overrideScope, itemScope }) => {
  let layoutScope = layout.scope;
  let newOverrideScope = overrideScope;
  if (itemScope) {
    layoutScope = layoutScope.replace(/\{scope\}/g, itemScope);
    if (newOverrideScope && layout.scope.includes("{scope}")) {
      newOverrideScope = layout.scope.replace(
        /\{scope\}\/?/g,
        newOverrideScope,
      );
    }
  }

  const parentSchema =
    resolveSchema(
      formData.schema,
      layoutScope.split("/").slice(0, -2).join("/"),
      formData.schema,
    ) ||
    (newOverrideScope
      ? resolveSchema(
          formData.schema,
          newOverrideScope.split("/").slice(0, -2).join("/"),
          formData.schema,
        )
      : {});

  const subSchema =
    resolveSchema(formData.schema, layoutScope, formData.schema) ||
    (newOverrideScope
      ? resolveSchema(formData.schema, newOverrideScope, formData.schema)
      : {});

  if (!subSchema) {
    return <>{"No valid Schema found"}</>;
  }

  const dataPath = toDataPathSegments(layoutScope);

  const FormTemplate = getTemplate(
    layout.type,
    formData.uiSchema.templates,
    layout["ui:template"],
  ) as Component<ControlTemplateProps>;

  const ErrorTemplate = getAdditionalTemplate(
    AdditionalTemplateType.ERROR,
    formData.uiSchema.templates,
    "defaultError",
  ) as Component<ErrorTemplateProps>;

  const TitleTemplate = getAdditionalTemplate(
    AdditionalTemplateType.FIELD,
    formData.uiSchema.templates,
    "defaultTitle",
  ) as Component<DefaultFieldTemplateProps>;

  const schemaType = (() => {
    if (parentSchema?.uniqueItems && subSchema.enum) {
      return "uniqueItemEnum";
    }
    if (subSchema.enum) {
      return "enum";
    }
    if (Array.isArray(subSchema.type)) {
      return subSchema.type[0];
    }
    return subSchema.type;
  })();

  const widget = (
    field: FieldStore<any, any>,
    props: FieldElementProps<any, any>,
  ) => {
    const FormWidget = getWidget({
      type: layout.type,
      widgets: formData.uiSchema.widgets,
      widget: layout["ui:widget"] || schemaType,
    }) as Component<ControlWidgetProps>;
    return (
      <FormWidget
        layout={layout}
        subSchema={subSchema as JSONSchema7Object}
        field={field}
        additionalProps={props}
      />
    );
  };

  useTask$(() => {
    if (!formData.internal.fields[dataPath.join(".")]) {
      formData.internal.fields[dataPath.join(".")] = getInitialFieldStore(
        dataPath.join("."),
      );
    }
  });

  return (
    <>
      <Field
        name={dataPath.join(".")}
        of={formData}
        type={schemaType}
        selectOptions={subSchema.enum}
        min={subSchema.minimum}
        max={subSchema.maximum}
        step={subSchema.multipleOf}
        default={subSchema.default}
        required={parentSchema?.required?.includes(
          dataPath[dataPath.length - 1],
        )}
      >
        {(field, props) => (
          <>
            {field ? (
              <FormTemplate
                field={field}
                layout={layout}
                subSchema={subSchema as JSONSchema7Object}
              >
                <TitleTemplate
                  q:slot="title"
                  layout={layout}
                  subSchema={subSchema as JSONSchema7Object}
                  required={parentSchema?.required?.includes(
                    dataPath[dataPath.length - 1],
                  )}
                  field={field}
                />
                <span q:slot="description">
                  {layout["ui:description"] || subSchema?.description}
                </span>
                {widget(field, props)}
                <ErrorTemplate
                  q:slot="errors"
                  errors={field.error}
                  dirty={field.dirty}
                />
              </FormTemplate>
            ) : (
              <></>
            )}
          </>
        )}
      </Field>
    </>
  );
});
