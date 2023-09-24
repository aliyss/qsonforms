import { component$, useSignal, $ } from "@builder.io/qwik";
import {
  AdditionalTemplateType,
  FromDataSchema,
  TemplateType,
  createUiSchema,
  useQSONForm,
} from ".";
import type { UiSchema } from "./models/uiSchema/build";
import Ajv from "ajv";
import { DefaultButton } from "./components/defaults/default-button";
import {
  DefaultPasswordWidget,
  DefaultStringWidget,
} from "./components/defaults/default-control-widgets";
const ajv = new Ajv({ allErrors: true });

export default component$(() => {
  const formData = {
    input: "hello",
    checkbox: true,
    initial: "empty",
  };
  const schema = {
    type: "object",
    properties: {
      initial: {
        title: "Initial Value",
        type: "string",
      },
      default: {
        title: "Default Value",
        type: "string",
        default: "Current Value",
      },
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
        minimum: 4,
        maximum: 8,
        multipleOf: 2,
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
          required: ["checkbox"],
        },
      },
    },
    required: ["input", "number", "initial"],
  } as FromDataSchema;

  const uiSchema = createUiSchema({
    templates: {
      [AdditionalTemplateType.BUTTON]: { removeButton: DefaultButton },
    },
    widgets: {
      [TemplateType.CONTROL]: {
        string: DefaultStringWidget,
        password: DefaultPasswordWidget,
      },
    },
    layout: {
      type: TemplateType.VERTICAL_LAYOUT,
      elements: [
        {
          type: TemplateType.CONTROL,
          scope: "#/properties/default",
        },
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
              ["ui:widget"]: "password",
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
      <head>
        <meta charSet="utf-8" />
      </head>
      <body lang="en" style="background: black;">
        <QSONForm onSubmit$={onSubmit} shouldActive={false} />
      </body>
    </>
  );
});
