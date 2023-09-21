import { $, Component, component$ } from "@builder.io/qwik";
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
}

export const ControlTemplateMaker = component$<ControlTemplateMakerProps>(
  ({ layout, formData }) => {
    const subSchema = resolveSchema(
      formData.schema,
      layout.scope,
      formData.schema,
    );
    const dataPath = toDataPathSegments(layout.scope);

    const FormTemplate = getTemplate(
      layout.type,
      formData.uiSchema.templates,
      layout["ui:template"],
    ) as Component<ControlTemplateProps>;

    const handleChange = $(async (value: any) => {
      console.log(value);
    });

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
          onChange$={(value: any) => handleChange(value)}
          additionalProps={props}
        />
      );
    };

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
