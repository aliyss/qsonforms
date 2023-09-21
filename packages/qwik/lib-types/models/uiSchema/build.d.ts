import { ControlTemplates, ControlWidgets, DefaultControlTemplates, DefaultControlWidgets, DefaultHorizontalTemplates, DefaultVerticalTemplates, HorizontalTemplates, Layout, Templates, VerticalTemplates, Widgets } from "../../types";
export declare function createUiSchema<V extends VerticalTemplates | DefaultVerticalTemplates = VerticalTemplates | DefaultVerticalTemplates, H extends HorizontalTemplates | DefaultHorizontalTemplates = HorizontalTemplates | DefaultHorizontalTemplates, C extends ControlTemplates | DefaultControlTemplates = ControlTemplates | DefaultControlTemplates, W extends ControlWidgets | DefaultControlWidgets = ControlWidgets | DefaultControlWidgets>({ templates, widgets, layout, }: {
    templates: Templates<V, H, C>;
    widgets: Widgets<W>;
    layout: Layout<V, H, C, W>;
}): {
    layout: Layout<V, H, C, W>;
    widgets: Widgets<W>;
    templates: Templates<V, H, C>;
};
export type UiSchema = ReturnType<typeof createUiSchema>;
