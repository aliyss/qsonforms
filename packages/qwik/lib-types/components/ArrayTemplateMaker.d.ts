import { Component } from "@builder.io/qwik";
import type { ArrayLayout, ArrayTemplateProps, ArrayTemplates, ControlTemplates, ControlWidgets, DefaultArrayTemplates, DefaultControlTemplates, DefaultControlWidgets, DefaultHorizontalTemplates, DefaultVerticalTemplates, FormStore, HorizontalTemplates, ResponseData, VerticalTemplates } from "../types";
interface ArrayTemplateMakerProps<S, T, TResponseData extends ResponseData<T> = ResponseData<T>, V extends VerticalTemplates | DefaultVerticalTemplates = VerticalTemplates | DefaultVerticalTemplates, H extends HorizontalTemplates | DefaultHorizontalTemplates = HorizontalTemplates | DefaultHorizontalTemplates, A extends ArrayTemplates | DefaultArrayTemplates = ArrayTemplates | DefaultArrayTemplates, C extends ControlTemplates | DefaultControlTemplates = ControlTemplates | DefaultControlTemplates, W extends ControlWidgets | DefaultControlWidgets = ControlWidgets | DefaultControlWidgets> {
    layout: ArrayLayout<V, H, A, C, W>;
    formData: FormStore<S, T, TResponseData>;
    overrideScope?: string;
    itemScope?: string;
}
export declare const ArrayTemplateMaker: Component<ArrayTemplateMakerProps<any, any, any, DefaultVerticalTemplates<import("../types").VerticalTemplateProps> | VerticalTemplates<import("../types").VerticalTemplateProps>, DefaultHorizontalTemplates<import("../types").HorizontalTemplateProps> | HorizontalTemplates<import("../types").HorizontalTemplateProps>, DefaultArrayTemplates<ArrayTemplateProps> | ArrayTemplates<ArrayTemplateProps>, DefaultControlTemplates<import("../types").ControlTemplateProps> | ControlTemplates<import("../types").ControlTemplateProps>, ControlWidgets<import("../types").ControlWidgetProps<import("../types").FieldStore<any, any>>> | DefaultControlWidgets<import("../types").ControlWidgetProps<import("../types").FieldStore<any, any>>>>>;
export {};
