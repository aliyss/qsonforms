import { Component } from "@builder.io/qwik";
import type { ArrayTemplates, ControlTemplates, ControlWidgets, DefaultArrayTemplates, DefaultControlTemplates, DefaultControlWidgets, DefaultHorizontalTemplates, DefaultVerticalTemplates, FormStore, FromData, HorizontalTemplateProps, HorizontalTemplates, Layout, Templates, VerticalTemplateProps, VerticalTemplates } from "../types";
export interface JSONFormParserProps<V extends VerticalTemplates | DefaultVerticalTemplates = VerticalTemplates | DefaultVerticalTemplates, H extends HorizontalTemplates | DefaultHorizontalTemplates = HorizontalTemplates | DefaultHorizontalTemplates, A extends ArrayTemplates | DefaultArrayTemplates = ArrayTemplates | DefaultArrayTemplates, C extends ControlTemplates | DefaultControlTemplates = ControlTemplates | DefaultControlTemplates, W extends ControlWidgets | DefaultControlWidgets = ControlWidgets | DefaultControlWidgets> {
    templates: Templates<V, H, A, C>;
    layout: Layout<V, H, A, C, W>;
    formData: FormStore<FromData<any>, any>;
    overrideScope?: string;
    itemScope?: string;
}
export declare const SchemaParser: Component<JSONFormParserProps<VerticalTemplates<VerticalTemplateProps> | DefaultVerticalTemplates<VerticalTemplateProps>, HorizontalTemplates<HorizontalTemplateProps> | DefaultHorizontalTemplates<HorizontalTemplateProps>, ArrayTemplates<import("../types").ArrayTemplateProps> | DefaultArrayTemplates<import("../types").ArrayTemplateProps>, ControlTemplates<import("../types").ControlTemplateProps> | DefaultControlTemplates<import("../types").ControlTemplateProps>, ControlWidgets<import("../types").ControlWidgetProps<import("../types").FieldStore<any, any>>> | DefaultControlWidgets<import("../types").ControlWidgetProps<import("../types").FieldStore<any, any>>>>>;
