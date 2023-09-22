import {
  ArrayTemplates,
  ControlTemplates,
  ControlWidgets,
  DefaultArrayTemplates,
  DefaultControlTemplates,
  DefaultControlWidgets,
  DefaultHorizontalTemplates,
  DefaultVerticalTemplates,
  HorizontalTemplates,
  TemplateType,
  Templates,
  VerticalTemplates,
  Widgets,
} from "../../types";
import { defaultTemplates, defaultWidgets } from "./defaults";

const getKeyValue =
  <U extends keyof T, T extends object>(key: U) =>
  (obj: T) =>
    obj[key];

export function getTemplate<
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
>(
  type: TemplateType,
  templates: Templates<V, H, A, C>,
  template: string | number | undefined,
) {
  if (!template && type === TemplateType.VERTICAL_LAYOUT) {
    template = "defaultVertical";
  } else if (!template && type === TemplateType.HORIZONTAL_LAYOUT) {
    template = "defaultHorizontal";
  } else if (!template && type === TemplateType.ARRAY) {
    template = "defaultArray";
  } else if (!template && type === TemplateType.CONTROL) {
    template = "defaultControl";
  }
  if (templates[type]) {
    const defaultTemplate = templates[type];
    if (defaultTemplate) {
      // This is probably not something I want.
      const templateData = getKeyValue<
        keyof typeof defaultTemplate,
        typeof defaultTemplate
      >(template as never)(defaultTemplate);
      if (templateData) {
        return templateData;
      }
    }
  }
  if (defaultTemplates[type]) {
    const defaultTemplate = defaultTemplates[type];
    // Neither is this.
    if (defaultTemplate) {
      const templateData = getKeyValue<
        keyof typeof defaultTemplate,
        typeof defaultTemplate
      >(template as never)(defaultTemplate);
      if (templateData) {
        return templateData;
      }
    }
  }
  throw new Error(`GetTemplate: Template ${template} is invalid.`);
}

export function getWidget<
  W extends ControlWidgets | DefaultControlWidgets =
    | ControlWidgets
    | DefaultControlWidgets,
>({
  type,
  widgets,
  widget,
}: {
  type: TemplateType.CONTROL;
  widgets: Widgets<W>;
  widget: string | number | undefined;
}) {
  if (!widget) {
    widget = "defaultControl";
  }
  if (widgets[type]) {
    const defaultWidget = widgets[type];
    if (defaultWidget) {
      // This is probably not something I want.
      const templateData = getKeyValue<
        keyof typeof defaultWidget,
        typeof defaultWidget
      >(widget as never)(defaultWidget);
      if (templateData) {
        return templateData;
      }
    }
  }
  if (defaultWidgets[type]) {
    const defaultWidget = defaultWidgets[type];
    // Neither is this.
    if (defaultWidget) {
      const templateData = getKeyValue<
        keyof typeof defaultWidget,
        typeof defaultWidget
      >(widget as never)(defaultWidget);
      if (templateData) {
        return templateData;
      }
    }
  }
  throw new Error(`GetWidget: Widget ${widget} is invalid.`);
}
