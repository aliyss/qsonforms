import { Component } from "@builder.io/qwik";
import type { ArrayLayout, ArrayTemplateProps, ArrayTemplates, ControlTemplates, ControlWidgets, DefaultArrayTemplates, DefaultControlTemplates, DefaultControlWidgets, DefaultHorizontalTemplates, DefaultVerticalTemplates, FormStore, HorizontalTemplates, VerticalTemplates } from "../types";
interface ArrayTemplateMakerProps<V extends VerticalTemplates | DefaultVerticalTemplates = VerticalTemplates | DefaultVerticalTemplates, H extends HorizontalTemplates | DefaultHorizontalTemplates = HorizontalTemplates | DefaultHorizontalTemplates, A extends ArrayTemplates | DefaultArrayTemplates = ArrayTemplates | DefaultArrayTemplates, C extends ControlTemplates | DefaultControlTemplates = ControlTemplates | DefaultControlTemplates, W extends ControlWidgets | DefaultControlWidgets = ControlWidgets | DefaultControlWidgets> {
    layout: ArrayLayout<V, H, A, C, W>;
    formData: FormStore<any, undefined>;
    overrideScope?: string;
    itemScope?: string;
}
export declare const ArrayTemplateMaker: Component<ArrayTemplateMakerProps<DefaultVerticalTemplates<import("../types").VerticalTemplateProps> | VerticalTemplates<import("../types").VerticalTemplateProps>, DefaultHorizontalTemplates<import("../types").HorizontalTemplateProps> | HorizontalTemplates<import("../types").HorizontalTemplateProps>, DefaultArrayTemplates<ArrayTemplateProps> | ArrayTemplates<ArrayTemplateProps>, DefaultControlTemplates<import("../types").ControlTemplateProps> | ControlTemplates<import("../types").ControlTemplateProps>, DefaultControlWidgets<import("../types").ControlWidgetProps<import("../types").FieldStore<any, any>>> | ControlWidgets<import("../types").ControlWidgetProps<import("../types").FieldStore<any, any>>>>>;
export {};
