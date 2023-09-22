import { Component, component$, useTask$ } from "@builder.io/qwik";
import {
  ControlElement,
  ControlTemplateProps,
  ControlTemplates,
  ControlWidgetProps,
  ControlWidgets,
  DefaultControlTemplates,
  DefaultControlWidgets,
  FormStore,
} from "../types";
import { resolveSchema } from "../models/schema/utils/resolvers";
import { toDataPathSegments } from "../models/schema/utils/path";
import { getTemplate, getWidget } from "../models/uiSchema/utils";
import { Field, FieldElementProps } from "./Field";
import { JSONSchema7Object } from "json-schema";
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
      resolveSchema(formData.schema, layoutScope, formData.schema) ||
      (newOverrideScope
        ? resolveSchema(formData.schema, newOverrideScope, formData.schema)
        : {});

    const dataPath = toDataPathSegments(layoutScope);

    const FormTemplate = getTemplate(
      layout.type,
      formData.uiSchema.templates,
      layout["ui:template"],
    ) as Component<ControlTemplateProps>;

    const widget = (value: any, props: FieldElementProps<any, any>) => {
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
          initialData={value}
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
              layout={layout}
              subSchema={subSchema as JSONSchema7Object}
            >
              {widget(field.value, props)}
            </FormTemplate>
          )}
        </Field>
      </>
    );
  },
);
