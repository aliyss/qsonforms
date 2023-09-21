import { DefaultControlTemplates, DefaultHorizontalTemplates, DefaultVerticalTemplates, TemplateType } from "./tempates";
import { DefaultControlWidgets } from "./widgets";
export interface ElementLayout {
    type: TemplateType;
    "ui:options"?: Record<string, any>;
    "ui:class"?: string;
}
export interface ControlElement<C, W> extends ElementLayout {
    type: TemplateType.CONTROL;
    scope: string;
    "ui:template"?: keyof (C & DefaultControlTemplates);
    "ui:widget"?: keyof (W & DefaultControlWidgets);
}
interface ViewLayout<V, H, C, W> extends ElementLayout {
    elements: Layout<V, H, C, W>[];
}
export interface HorizontalLayout<V, H, C, W> extends ViewLayout<V, H, C, W> {
    type: TemplateType.HORIZONTAL_LAYOUT;
    "ui:template"?: keyof (H & DefaultHorizontalTemplates);
}
export interface VerticalLayout<V, H, C, W> extends ViewLayout<V, H, C, W> {
    type: TemplateType.VERTICAL_LAYOUT;
    "ui:template"?: keyof (V & DefaultVerticalTemplates);
}
export type Layout<V, H, C, W> = HorizontalLayout<V, H, C, W> | VerticalLayout<V, H, C, W> | ControlElement<C, W>;
export {};
