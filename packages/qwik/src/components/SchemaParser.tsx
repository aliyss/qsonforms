import { Component, component$, useStyles$ } from "@builder.io/qwik";
import type {
  ArrayTemplates,
  ControlTemplates,
  ControlWidgets,
  DefaultArrayTemplates,
  DefaultControlTemplates,
  DefaultControlWidgets,
  DefaultHorizontalTemplates,
  DefaultVerticalTemplates,
  FormStore,
  FromData,
  HorizontalTemplateProps,
  HorizontalTemplates,
  Layout,
  ResponseData,
  Templates,
  VerticalTemplateProps,
  VerticalTemplates,
} from "../types";
import { TemplateType } from "../types";
import { getTemplate } from "../models/uiSchema/utils";
import { ControlTemplateMaker } from "./ControlTemplateMaker";
import defaultClasses from "./defaults/default-classes.css?inline";
import { ArrayTemplateMaker } from "./ArrayTemplateMaker";

export interface JSONFormParserProps<
  S,
  T,
  TResponseData extends ResponseData<T> = ResponseData<T>,
  V extends VerticalTemplates | DefaultVerticalTemplates =
    | VerticalTemplates
    | DefaultVerticalTemplates,
  H extends HorizontalTemplates | DefaultHorizontalTemplates =
    | HorizontalTemplates
    | DefaultHorizontalTemplates,
  A extends ArrayTemplates | DefaultArrayTemplates =
    | ArrayTemplates
    | DefaultArrayTemplates,
  C extends ControlTemplates | DefaultControlTemplates =
    | ControlTemplates
    | DefaultControlTemplates,
  W extends ControlWidgets | DefaultControlWidgets =
    | ControlWidgets
    | DefaultControlWidgets,
> {
  templates: Templates<V, H, A, C>;
  layout: Layout<V, H, A, C, W>;
  formData: FormStore<S, FromData<T>, TResponseData>;
  overrideScope?: string;
  itemScope?: string;
}

export const SchemaParser = component$<JSONFormParserProps<any, any>>(
  ({ layout, templates, formData, overrideScope, itemScope }) => {
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
            overrideScope={overrideScope}
            itemScope={itemScope}
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
            overrideScope={overrideScope}
            itemScope={itemScope}
          />
        );
      });
      return (
        <Template grid={true} layout={layout}>
          {items}
        </Template>
      );
    }
    if (layout.type === TemplateType.ARRAY) {
      return (
        <ArrayTemplateMaker
          layout={layout}
          formData={formData}
          overrideScope={overrideScope}
          itemScope={itemScope}
        />
      );
    }
    if (layout.type === TemplateType.CONTROL) {
      return (
        <>
          <ControlTemplateMaker
            layout={layout}
            formData={formData}
            overrideScope={overrideScope}
            itemScope={itemScope}
          />
        </>
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
