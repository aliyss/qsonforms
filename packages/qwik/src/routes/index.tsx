import { component$, $, useSignal } from "@builder.io/qwik";
import { UiSchema, createUiSchema } from "../models/uiSchema/build";
import { TemplateType } from "../types";
import { useQJSONForm } from "../hooks";
import { JSONSchema7 } from "json-schema";
import { Field } from "../components/Field";

export default component$(() => {
  const formData = { input: "hello", checkbox: true, number: undefined };
  const schema = {
    type: "object",
    properties: {
      input: {
        title: "String",
        type: "string",
        minLength: 1,
      },
      checkbox: {
        title: "Checkbox",
        type: "boolean",
      },
      number: {
        title: "Number",
        type: "number",
        min: 1,
      },
    },
    required: ["input"],
  } as JSONSchema7;

  const uiSchema = createUiSchema({
    templates: {},
    widgets: {},
    layout: {
      type: TemplateType.VERTICAL_LAYOUT,
      elements: [
        {
          type: TemplateType.HORIZONTAL_LAYOUT,
          elements: [
            {
              type: TemplateType.CONTROL,
              scope: "#/properties/input",
            },
            {
              type: TemplateType.CONTROL,
              scope: "#/properties/number",
            },
          ],
        },
        {
          type: TemplateType.VERTICAL_LAYOUT,
          elements: [
            {
              type: TemplateType.CONTROL,
              scope: "#/properties/input",
            },
            {
              type: TemplateType.CONTROL,
              scope: "#/properties/checkbox",
            },
          ],
        },
        {
          type: TemplateType.HORIZONTAL_LAYOUT,
          elements: [],
        },
        {
          type: TemplateType.HORIZONTAL_LAYOUT,
          elements: [
            {
              type: TemplateType.CONTROL,
              scope: "#/properties/number",
            },
          ],
        },
      ],
    },
  }) as UiSchema;
  const [usableFormData, { QJSONForm }] = useQJSONForm(schema, {
    loader: useSignal(formData),
    uiSchema: uiSchema,
  });

  const onSubmit = $((value: any) => {
    console.log(value);
  });

  return (
    <>
      <QJSONForm onSubmit$={onSubmit}>
        <div>
          <Field of={usableFormData} name="input">
            {(data, props) => {
              return <input value={data.value} {...props}></input>;
            }}
          </Field>
          <Field of={usableFormData} name="input">
            {(data, props) => {
              return <input value={data.value} {...props}></input>;
            }}
          </Field>
          <Field of={usableFormData} name="checkbox">
            {(data, props) => {
              return (
                <input type="checkbox" checked={data.value} {...props}></input>
              );
            }}
          </Field>
        </div>
        <button type="submit">Save</button>
      </QJSONForm>
    </>
  );
});
