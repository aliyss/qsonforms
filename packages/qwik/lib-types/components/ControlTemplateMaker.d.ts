import { Component } from "@builder.io/qwik";
import type { ControlElement, ControlTemplateProps, ControlTemplates, ControlWidgetProps, ControlWidgets, DefaultControlTemplates, DefaultControlWidgets, FieldStore, FormStore } from "../types";
interface ControlTemplateMakerProps<C extends ControlTemplates | DefaultControlTemplates = ControlTemplates | DefaultControlTemplates, W extends ControlWidgets | DefaultControlWidgets = ControlWidgets | DefaultControlWidgets> {
    layout: ControlElement<C, W>;
    formData: FormStore<any, undefined>;
    overrideScope?: string;
    itemScope?: string;
}
export declare const ControlTemplateMaker: Component<ControlTemplateMakerProps<DefaultControlTemplates<ControlTemplateProps> | ControlTemplates<ControlTemplateProps>, DefaultControlWidgets<ControlWidgetProps<FieldStore<any, any>>> | ControlWidgets<ControlWidgetProps<FieldStore<any, any>>>>>;
export {};
