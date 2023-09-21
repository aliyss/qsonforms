import { Component, component$, useStyles$ } from "@builder.io/qwik";
import {
  ControlTemplates,
  ControlWidgets,
  DefaultControlTemplates,
  DefaultControlWidgets,
  DefaultHorizontalTemplates,
  DefaultVerticalTemplates,
  FormStore,
  FromData,
  HorizontalTemplateProps,
  HorizontalTemplates,
  Layout,
  TemplateType,
  Templates,
  VerticalTemplateProps,
  VerticalTemplates,
} from "../types";
import { getTemplate } from "../models/uiSchema/utils";
import { ControlTemplateMaker } from "./ControlTemplateMaker";
import defaultClasses from "./defaults/default-classes.css?inline";

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
  formData: FormStore<FromData<any>, any>;
}

export const SchemaParser = component$<JSONFormParserProps>(
  ({ layout, templates, formData }) => {
    useStyles$(defaultClasses);
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
