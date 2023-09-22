import { component$, useSignal, $ } from "@builder.io/qwik";
import { TemplateType, createUiSchema, useQJSONForm } from ".";
import { UiSchema } from "./models/uiSchema/build";
import { JSONSchema7 } from "json-schema";

export default component$(() => {
  const formData = {
    input: "hello",
    checkbox: true,
  };
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
      object: {
        title: "Object",
        type: "object",
        properties: {
          checkbox: {
            title: "Checkbox",
            type: "boolean",
          },
          number: {
            title: "Number",
            type: "number",
          },
        },
      },
      array: {
        title: "Array",
        type: "array",
        items: {
          title: "Number",
          type: "number",
        },
      },
      arrayInArray: {
        title: "Array",
        type: "array",
        items: {
          title: "SubArray",
          type: "array",
          items: {
            title: "Number",
            type: "number",
          },
        },
      },
      arrayWithObject: {
        title: "Array",
        type: "array",
        items: {
          title: "Object",
          type: "object",
          properties: {
            checkbox: {
              title: "Checkbox",
              type: "boolean",
            },
            number: {
              title: "Number",
              type: "number",
            },
            array: {
              title: "Array",
              type: "array",
              items: {
                title: "Number",
                type: "number",
              },
            },
          },
        },
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
          type: TemplateType.HORIZONTAL_LAYOUT,
          elements: [
            {
              type: TemplateType.CONTROL,
              scope: "#/properties/input",
            },
          ],
        },
        {
          type: TemplateType.VERTICAL_LAYOUT,
          elements: [
            {
              type: TemplateType.CONTROL,
              scope: "#/properties/checkbox",
            },
            {
              type: TemplateType.ARRAY,
              scope: "#/properties/array",
            },
            {
              type: TemplateType.ARRAY,
              scope: "#/properties/array",
              ["ui:items"]: {
                type: TemplateType.HORIZONTAL_LAYOUT,
                elements: [
                  {
                    type: TemplateType.CONTROL,
                    scope: "#/properties/checkbox",
                  },
                  {
                    type: TemplateType.CONTROL,
                    scope: "{scope}",
                  },
                ],
              },
            },
            {
              type: TemplateType.ARRAY,
              scope: "#/properties/arrayInArray",
              ["ui:items"]: {
                type: TemplateType.ARRAY,
                scope: "{scope}",
              },
            },
          ],
        },
        {
          type: TemplateType.HORIZONTAL_LAYOUT,
          elements: [
            {
              type: TemplateType.CONTROL,
              scope: "#/properties/object/properties/checkbox",
            },
            {
              type: TemplateType.ARRAY,
              scope: "#/properties/arrayWithObject",
              ["ui:items"]: {
                type: TemplateType.HORIZONTAL_LAYOUT,
                elements: [
                  {
                    type: TemplateType.CONTROL,
                    scope: "{scope}/properties/checkbox",
                  },
                  {
                    type: TemplateType.ARRAY,
                    scope: "{scope}/properties/array",
                  },
                ],
              },
            },
          ],
        },
      ],
    },
  }) as UiSchema;

  const [, { QJSONForm }] = useQJSONForm(schema, {
    loader: useSignal(formData),
    uiSchema: uiSchema,
  });

  const onSubmit = $((value: any) => {
    console.log(value);
  });
  return (
    <>
      <head>
        <meta charSet="utf-8" />
      </head>
      <body lang="en">
        <QJSONForm onSubmit$={onSubmit} />
      </body>
    </>
  );
});
