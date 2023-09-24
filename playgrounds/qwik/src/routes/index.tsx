import { component$, $, useSignal } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import Ajv from "ajv";
import {
  AdditionalTemplateType,
  FromDataSchema,
  TemplateType,
  createUiSchema,
  useQSONForm,
} from "qsonforms";
import type { UiSchema } from "qsonforms";
const ajv = new Ajv();

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
    required: ["input", "number"],
  } as FromDataSchema;

  const uiSchema = createUiSchema({
    templates: {
      [AdditionalTemplateType.BUTTON]: {},
    },
    widgets: {},
    layout: {
      type: TemplateType.VERTICAL_LAYOUT,
      elements: [
        {
          type: TemplateType.HORIZONTAL_LAYOUT,
          ["ui:template"]: "defaultHorizontal",
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

  const validate = $((values: any) => {
    const validator = ajv.compile(schema);
    const result = validator(values);
    if (!result) {
      console.log(validator.errors);
      return validator.errors;
    }
    return [];
  });

  const [, { QSONForm }] = useQSONForm(schema, {
    loader: useSignal(formData),
    uiSchema: uiSchema,
    validate: validate,
    validateOn: "input",
    revalidateOn: "input",
  });

  const onSubmit = $((value: any) => {
    console.log(value);
  });

  return (
    <>
      <QSONForm onSubmit$={onSubmit} />
    </>
  );
});

export const head: DocumentHead = {
  title: "Test of QJSONForm",
};
