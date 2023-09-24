import { Component, component$, useTask$ } from "@builder.io/qwik";
import type {
  ControlElement,
  ControlTemplateProps,
  ControlTemplates,
  ControlWidgetProps,
  ControlWidgets,
  DefaultControlTemplates,
  DefaultControlWidgets,
  ErrorTemplateProps,
  FieldStore,
  FormStore,
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
import type { JSONSchema7, JSONSchema7Object } from "json-schema";
import { getInitialFieldStore } from "../utils/getInitialFieldStore";

interface ControlTemplateMakerProps<
  C extends ControlTemplates | DefaultControlTemplates =
    | ControlTemplates
    | DefaultControlTemplates,
  W extends ControlWidgets | DefaultControlWidgets =
    | ControlWidgets
    | DefaultControlWidgets,
> {
  layout: ControlElement<C, W>;
  formData: FormStore<any, undefined>;
  overrideScope?: string;
  itemScope?: string;
}

export const ControlTemplateMaker = component$<ControlTemplateMakerProps>(
  ({ layout, formData, overrideScope, itemScope }) => {
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

    const subSchema =
      resolveSchema(
        formData.schema as JSONSchema7,
        layoutScope,
        formData.schema as JSONSchema7,
      ) ||
      (newOverrideScope
        ? resolveSchema(
            formData.schema as JSONSchema7,
            newOverrideScope,
            formData.schema as JSONSchema7,
          )
        : {});

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

    const widget = (
      field: FieldStore<any, any>,
      props: FieldElementProps<any, any>,
    ) => {
      const FormWidget = getWidget({
        type: layout.type,
        widgets: formData.uiSchema.widgets,
        widget:
          layout["ui:widget"] ||
          (subSchema?.type as "string" | "boolean" | "number"),
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
          type={subSchema?.type as "string" | "boolean" | "number"}
        >
          {(field, props) => (
            <FormTemplate
              field={field}
              layout={layout}
              subSchema={subSchema as JSONSchema7Object}
            >
              {widget(field, props)}
              <ErrorTemplate q:slot="errors" errors={field.error} />
            </FormTemplate>
          )}
        </Field>
      </>
    );
  },
);
