import { Component } from "@builder.io/qwik";
import { ControlTemplates, ControlWidgets, DefaultControlTemplates, DefaultControlWidgets, DefaultHorizontalTemplates, DefaultVerticalTemplates, FormStore, FromData, HorizontalTemplateProps, HorizontalTemplates, Layout, Templates, VerticalTemplateProps, VerticalTemplates } from "../types";
export interface JSONFormParserProps<V extends VerticalTemplates | DefaultVerticalTemplates = VerticalTemplates | DefaultVerticalTemplates, H extends HorizontalTemplates | DefaultHorizontalTemplates = HorizontalTemplates | DefaultHorizontalTemplates, C extends ControlTemplates | DefaultControlTemplates = ControlTemplates | DefaultControlTemplates, W extends ControlWidgets | DefaultControlWidgets = ControlWidgets | DefaultControlWidgets> {
    templates: Templates<V, H, C>;
    layout: Layout<V, H, C, W>;
    formData: FormStore<FromData<any>, any>;
}
export declare const SchemaParser: Component<JSONFormParserProps<VerticalTemplates<VerticalTemplateProps> | DefaultVerticalTemplates<VerticalTemplateProps>, HorizontalTemplates<HorizontalTemplateProps> | DefaultHorizontalTemplates<HorizontalTemplateProps>, ControlTemplates<import("../types").ControlTemplateProps> | DefaultControlTemplates<import("../types").ControlTemplateProps>, ControlWidgets<import("../types").ControlWidgetProps<any>> | DefaultControlWidgets<import("../types").ControlWidgetProps<any>>>>;
