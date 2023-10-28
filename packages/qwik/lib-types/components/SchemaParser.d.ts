import { Component } from "@builder.io/qwik";
import type { ArrayTemplates, ControlTemplates, ControlWidgets, DefaultArrayTemplates, DefaultControlTemplates, DefaultControlWidgets, DefaultHorizontalTemplates, DefaultVerticalTemplates, FormStore, FromData, HorizontalTemplateProps, HorizontalTemplates, Layout, ResponseData, Templates, VerticalTemplateProps, VerticalTemplates } from "../types";
export interface JSONFormParserProps<S, T, TResponseData extends ResponseData<T> = ResponseData<T>, V extends VerticalTemplates | DefaultVerticalTemplates = VerticalTemplates | DefaultVerticalTemplates, H extends HorizontalTemplates | DefaultHorizontalTemplates = HorizontalTemplates | DefaultHorizontalTemplates, A extends ArrayTemplates | DefaultArrayTemplates = ArrayTemplates | DefaultArrayTemplates, C extends ControlTemplates | DefaultControlTemplates = ControlTemplates | DefaultControlTemplates, W extends ControlWidgets | DefaultControlWidgets = ControlWidgets | DefaultControlWidgets> {
    templates: Templates<V, H, A, C>;
    layout: Layout<V, H, A, C, W>;
    formData: FormStore<S, FromData<T>, TResponseData>;
    overrideScope?: string;
    itemScope?: string;
}
export declare const SchemaParser: Component<JSONFormParserProps<any, any, any, DefaultVerticalTemplates<VerticalTemplateProps> | VerticalTemplates<VerticalTemplateProps>, DefaultHorizontalTemplates<HorizontalTemplateProps> | HorizontalTemplates<HorizontalTemplateProps>, DefaultArrayTemplates<import("../types").ArrayTemplateProps> | ArrayTemplates<import("../types").ArrayTemplateProps>, DefaultControlTemplates<import("../types").ControlTemplateProps> | ControlTemplates<import("../types").ControlTemplateProps>, ControlWidgets<import("../types").ControlWidgetProps<import("../types").FieldStore<any, any>>> | DefaultControlWidgets<import("../types").ControlWidgetProps<import("../types").FieldStore<any, any>>>>>;
