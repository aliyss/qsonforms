import { Component } from "@builder.io/qwik";
import { ArrayLayout, ArrayTemplateProps, ArrayTemplates, ControlTemplates, ControlWidgets, DefaultArrayTemplates, DefaultControlTemplates, DefaultControlWidgets, DefaultHorizontalTemplates, DefaultVerticalTemplates, FormStore, HorizontalTemplates, VerticalTemplates } from "../types";
interface ArrayTemplateMakerProps<V extends VerticalTemplates | DefaultVerticalTemplates = VerticalTemplates | DefaultVerticalTemplates, H extends HorizontalTemplates | DefaultHorizontalTemplates = HorizontalTemplates | DefaultHorizontalTemplates, A extends ArrayTemplates | DefaultArrayTemplates = ArrayTemplates | DefaultArrayTemplates, C extends ControlTemplates | DefaultControlTemplates = ControlTemplates | DefaultControlTemplates, W extends ControlWidgets | DefaultControlWidgets = ControlWidgets | DefaultControlWidgets> {
    layout: ArrayLayout<V, H, A, C, W>;
    formData: FormStore<any, undefined>;
    overrideScope?: string;
    itemScope?: string;
}
export declare const ArrayTemplateMaker: Component<ArrayTemplateMakerProps<VerticalTemplates<import("../types").VerticalTemplateProps> | DefaultVerticalTemplates<import("../types").VerticalTemplateProps>, HorizontalTemplates<import("../types").HorizontalTemplateProps> | DefaultHorizontalTemplates<import("../types").HorizontalTemplateProps>, ArrayTemplates<ArrayTemplateProps> | DefaultArrayTemplates<ArrayTemplateProps>, ControlTemplates<import("../types").ControlTemplateProps> | DefaultControlTemplates<import("../types").ControlTemplateProps>, ControlWidgets<import("../types").ControlWidgetProps<import("../types").FieldStore<any, any>>> | DefaultControlWidgets<import("../types").ControlWidgetProps<import("../types").FieldStore<any, any>>>>>;
export {};
