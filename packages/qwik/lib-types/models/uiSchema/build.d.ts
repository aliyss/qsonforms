import { ArrayTemplates, ControlTemplates, ControlWidgets, DefaultArrayTemplates, DefaultControlTemplates, DefaultControlWidgets, DefaultHorizontalTemplates, DefaultVerticalTemplates, HorizontalTemplates, Layout, Templates, VerticalTemplates, Widgets } from "../../types";
export declare function createUiSchema<V extends VerticalTemplates | DefaultVerticalTemplates = VerticalTemplates | DefaultVerticalTemplates, H extends HorizontalTemplates | DefaultHorizontalTemplates = HorizontalTemplates | DefaultHorizontalTemplates, A extends ArrayTemplates | DefaultArrayTemplates = ArrayTemplates | DefaultArrayTemplates, C extends ControlTemplates | DefaultControlTemplates = ControlTemplates | DefaultControlTemplates, W extends ControlWidgets | DefaultControlWidgets = ControlWidgets | DefaultControlWidgets>({ templates, widgets, layout, }: {
    templates: Templates<V, H, A, C>;
    widgets: Widgets<W>;
    layout: Layout<V, H, A, C, W>;
}): {
    layout: Layout<V, H, A, C, W>;
    widgets: Widgets<W>;
    templates: Templates<V, H, A, C>;
};
export type UiSchema = ReturnType<typeof createUiSchema>;
