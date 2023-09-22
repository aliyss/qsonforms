import { Component, QwikIntrinsicElements } from "@builder.io/qwik";
import { FormErrors } from "./form";
export declare enum AdditionalTemplateType {
    BUTTON = "Button",
    ERROR = "Error"
}
export interface ButtonTemplateProps {
    props: QwikIntrinsicElements["button"];
}
export interface ErrorTemplateProps {
    errors: FormErrors;
}
export interface DefaultButtonTemplates<CP extends ButtonTemplateProps = ButtonTemplateProps> {
    addButton?: Component<CP>;
    removeButton?: Component<CP>;
    moveUpButton?: Component<CP>;
    moveDownButton?: Component<CP>;
}
export interface DefaultErrorTemplates<CP extends ErrorTemplateProps = ErrorTemplateProps> {
    defaultError?: Component<CP>;
}
export interface DefaultAdditionals {
    [AdditionalTemplateType.BUTTON]?: DefaultButtonTemplates<ButtonTemplateProps>;
    [AdditionalTemplateType.ERROR]?: DefaultErrorTemplates<ErrorTemplateProps>;
}
