import type { AdditionalTemplateType, ArrayTemplates, ControlTemplates, ControlWidgets, DefaultAdditionals, DefaultArrayTemplates, DefaultControlTemplates, DefaultControlWidgets, DefaultHorizontalTemplates, DefaultVerticalTemplates, HorizontalTemplates, Templates, VerticalTemplates, Widgets } from "../../types";
import { TemplateType } from "../../types";
export declare function getTemplate<V extends VerticalTemplates | DefaultVerticalTemplates = VerticalTemplates | DefaultVerticalTemplates, H extends HorizontalTemplates | DefaultHorizontalTemplates = HorizontalTemplates | DefaultHorizontalTemplates, A extends ArrayTemplates | DefaultArrayTemplates = ArrayTemplates | DefaultArrayTemplates, C extends ControlTemplates | DefaultControlTemplates = ControlTemplates | DefaultControlTemplates>(type: TemplateType, templates: Templates<V, H, A, C>, template: string | number | undefined): NonNullable<(V | H | A | C)[keyof V & keyof H & keyof A & keyof C]>;
export declare function getWidget<W extends ControlWidgets | DefaultControlWidgets = ControlWidgets | DefaultControlWidgets>({ type, widgets, widget, }: {
    type: TemplateType.CONTROL;
    widgets: Widgets<W>;
    widget: string | number | undefined;
}): import("@builder.io/qwik").Component<import("../../types").ControlWidgetProps<import("../../types").FieldStore<any, any>>>;
export declare function getAdditionalTemplate(type: AdditionalTemplateType, additionals: DefaultAdditionals, template: string): never;
