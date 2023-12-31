import type { Component, QwikIntrinsicElements } from "@builder.io/qwik";
import type { FormErrors } from "./form";
import { FieldStore } from "./field";
import { JSONSchema7Object } from "json-schema";
import { ElementLayout } from "./layout";
export declare enum AdditionalTemplateType {
    BUTTON = "Button",
    ERROR = "Error",
    FIELD = "Field",
    ARRAY_ITEM = "ArrayItem"
}
export interface ButtonTemplateProps {
    props: QwikIntrinsicElements["button"];
}
export interface ErrorTemplateProps {
    errors: FormErrors;
    dirty: boolean;
}
export interface DefaultFieldTemplateProps {
    field?: FieldStore<any, any>;
    layout: ElementLayout;
    subSchema: JSONSchema7Object;
    required?: boolean | undefined;
}
export interface DefaultArrayItemTemplateProps {
    itemPath: string;
    layout: ElementLayout;
    subSchema: JSONSchema7Object;
    isUniqueEnum: boolean;
}
export interface DefaultButtonTemplates<CP extends ButtonTemplateProps = ButtonTemplateProps> {
    addButton?: Component<CP>;
    removeButton?: Component<CP>;
    moveUpButton?: Component<CP>;
    moveDownButton?: Component<CP>;
    submitButton?: Component<CP>;
}
export interface DefaultErrorTemplates<CP extends ErrorTemplateProps = ErrorTemplateProps> {
    defaultError?: Component<CP>;
}
export interface DefaultFieldTemplates<CP extends DefaultFieldTemplateProps = DefaultFieldTemplateProps> {
    defaultTitle?: Component<CP>;
    defaultArrayTitle?: Component<CP>;
}
export interface DefaultArrayItemTemplates<CP extends DefaultArrayItemTemplateProps = DefaultArrayItemTemplateProps> {
    defaultArrayItem?: Component<CP>;
}
export interface DefaultAdditionals {
    [AdditionalTemplateType.BUTTON]?: DefaultButtonTemplates<ButtonTemplateProps>;
    [AdditionalTemplateType.ERROR]?: DefaultErrorTemplates<ErrorTemplateProps>;
    [AdditionalTemplateType.FIELD]?: DefaultFieldTemplates<DefaultFieldTemplateProps>;
    [AdditionalTemplateType.ARRAY_ITEM]?: DefaultArrayItemTemplates<DefaultArrayItemTemplateProps>;
}
