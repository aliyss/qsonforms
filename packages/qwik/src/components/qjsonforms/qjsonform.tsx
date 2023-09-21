import {
  Component,
  component$,
  useContext,
  useContextProvider,
  useSignal,
  $,
  useStyles$,
} from "@builder.io/qwik";
import { UiSchema } from "../../models/uiSchema/build";
import {
  ControlElement,
  TemplateType,
  Layout,
} from "../../models/uiSchema/layouts";
import {
  ControlTemplateProps,
  ControlTemplates,
  HorizontalTemplateProps,
  HorizontalTemplates,
  VerticalTemplateProps,
  VerticalTemplates,
  Templates,
} from "../../models/uiSchema/templates";
import {
  DefaultControlTemplates,
  DefaultControlWidgets,
  DefaultHorizontalTemplates,
  DefaultVerticalTemplates,
} from "../../models/uiSchema/defaults";
import { getTemplate, getWidget } from "../../models/uiSchema/utils";
import { SchemaContext } from "../../stores/schemaStore";
import { JSONSchema7, JSONSchema7Object } from "json-schema";
import Ajv, { Schema } from "ajv";
import { UiSchemaContext } from "../../stores/uiSchemaStore";
import {
  ControlWidgetProps,
  ControlWidgets,
} from "../../models/uiSchema/widgets";
import { resolveSchema } from "../../models/schema/utils/resolvers";
import { toDataPathSegments } from "../../models/schema/utils/path";
import {
  Field,
  FieldElementProps,
  FormStore,
  useForm,
} from "@modular-forms/qwik";
import defaultClasses from "../../models/uiSchema/defaults/default-classes.css?inline";

export interface QJSONFormProps {
  schema: JSONSchema7Object;
  uiSchema: UiSchema;
  formData: any;
  validator?: Ajv;
}

export const QJSONForm = component$<QJSONFormProps>(
  ({ schema, uiSchema, formData, validator = new Ajv() }) => {
    useStyles$(defaultClasses);
    const schemaSignal = useSignal<JSONSchema7>(schema);
    useContextProvider(SchemaContext, schemaSignal);

    const uiSchemaSignal = useSignal<UiSchema>(uiSchema);
    useContextProvider(UiSchemaContext, uiSchemaSignal);

    const data = useSignal<any>(formData);
    const [defaultFormData, { Form }] = useForm({
      loader: data,
    });

    const handleSubmit = $((values: any) => {
      console.log(values);
    });

    if (uiSchema.layout) {
      return (
        <>
          <Form onSubmit$={handleSubmit}>
            <SchemaParser
              layout={uiSchema.layout}
              templates={uiSchema.templates}
              formData={defaultFormData}
            />
            <button type="submit">Test</button>
          </Form>
        </>
      );
    }
    return <></>;
  },
);

export interface JSONFormParserProps<
  V extends VerticalTemplates | DefaultVerticalTemplates =
    | VerticalTemplates
    | DefaultVerticalTemplates,
  H extends HorizontalTemplates | DefaultHorizontalTemplates =
    | HorizontalTemplates
    | DefaultHorizontalTemplates,
  C extends ControlTemplates | DefaultControlTemplates =
    | ControlTemplates
    | DefaultControlTemplates,
  W extends ControlWidgets | DefaultControlWidgets =
    | ControlWidgets
    | DefaultControlWidgets,
> {
  templates: Templates<V, H, C>;
  layout: Layout<V, H, C, W>;
  formData: FormStore<any, undefined>;
}

export const SchemaParser = component$<JSONFormParserProps>(
  ({ layout, templates, formData }) => {
    if (layout.type === TemplateType.HORIZONTAL_LAYOUT) {
      const Template = getTemplate(
        layout.type,
        templates,
        layout["ui:template"],
      ) as Component<HorizontalTemplateProps>;
      const items = layout.elements.map((x, i) => {
        return (
          <SchemaParser
            key={i}
            layout={x}
            templates={templates}
            formData={formData}
          />
        );
      });
      return (
        <Template grid={true} flex={false} layout={layout}>
          {items}
        </Template>
      );
    }
    if (layout.type === TemplateType.VERTICAL_LAYOUT) {
      const Template = getTemplate(
        layout.type,
        templates,
        layout["ui:template"],
      ) as Component<VerticalTemplateProps>;
      const items = layout.elements.map((x, i) => {
        return (
          <SchemaParser
            key={i}
            layout={x}
            templates={templates}
            formData={formData}
          />
        );
      });
      return (
        <Template grid={true} layout={layout}>
          {items}
        </Template>
      );
    }
    if (layout.type === TemplateType.CONTROL) {
      return (
        <ControlTemplateMaker
          layout={layout}
          formData={formData}
        ></ControlTemplateMaker>
      );
    }
    throw new Error(
      `SchemaParser: Layout Type is invalid at: ${JSON.stringify(
        layout,
        null,
        4,
      )}`,
    );
  },
);

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

const ControlTemplateMaker = component$<ControlTemplateMakerProps>(
  ({ layout, formData }) => {
    const uiSchema = useContext(UiSchemaContext);
    const schema = useContext(SchemaContext);

    const subSchema = resolveSchema(schema.value, layout.scope, schema.value);
    const dataPath = toDataPathSegments(layout.scope);

    const FormTemplate = getTemplate(
      layout.type,
      uiSchema.value.templates,
      layout["ui:template"],
    ) as Component<ControlTemplateProps>;

    const handleChange = $(async (value: any) => {
      console.log(value);
    });

    const widget = (value: any, props: FieldElementProps<any, any>) => {
      const FormWidget = getWidget(
        layout.type,
        uiSchema.value.widgets,
        layout["ui:widget"] ||
          (subSchema?.type as "string" | "boolean" | "number"),
      ) as Component<ControlWidgetProps>;
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
        <pre>{JSON.stringify(subSchema, null, 4)}</pre>
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
