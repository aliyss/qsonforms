import { Component } from "@builder.io/qwik";
import type { ControlElement, ControlTemplateProps, ControlTemplates, ControlWidgetProps, ControlWidgets, DefaultControlTemplates, DefaultControlWidgets, FieldStore, FormStore, ResponseData } from "../types";
interface ControlTemplateMakerProps<S, T, TResponseData extends ResponseData<T> = ResponseData<T>, C extends ControlTemplates | DefaultControlTemplates = ControlTemplates | DefaultControlTemplates, W extends ControlWidgets | DefaultControlWidgets = ControlWidgets | DefaultControlWidgets> {
    layout: ControlElement<C, W>;
    formData: FormStore<S, T, TResponseData>;
    overrideScope?: string;
    itemScope?: string;
}
export declare const ControlTemplateMaker: Component<ControlTemplateMakerProps<any, any, any, DefaultControlTemplates<ControlTemplateProps> | ControlTemplates<ControlTemplateProps>, ControlWidgets<ControlWidgetProps<FieldStore<any, any>>> | DefaultControlWidgets<ControlWidgetProps<FieldStore<any, any>>>>>;
export {};
