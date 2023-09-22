import { Component } from "@builder.io/qwik";
import { ControlElement, ControlTemplateProps, ControlTemplates, ControlWidgetProps, ControlWidgets, DefaultControlTemplates, DefaultControlWidgets, FormStore } from "../types";
interface ControlTemplateMakerProps<C extends ControlTemplates | DefaultControlTemplates = ControlTemplates | DefaultControlTemplates, W extends ControlWidgets | DefaultControlWidgets = ControlWidgets | DefaultControlWidgets> {
    layout: ControlElement<C, W>;
    formData: FormStore<any, undefined>;
    overrideScope?: string;
    itemScope?: string;
}
export declare const ControlTemplateMaker: Component<ControlTemplateMakerProps<ControlTemplates<ControlTemplateProps> | DefaultControlTemplates<ControlTemplateProps>, ControlWidgets<ControlWidgetProps<any>> | DefaultControlWidgets<ControlWidgetProps<any>>>>;
export {};
