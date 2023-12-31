import type { Component } from "@builder.io/qwik";
import type { ElementLayout } from "./layout";
import type { JSONSchema7Type } from "json-schema";
import type { FieldStore } from "./field";
export declare enum TemplateType {
    VERTICAL_LAYOUT = "VerticalLayout",
    HORIZONTAL_LAYOUT = "HorizontalLayout",
    ARRAY = "Array",
    CONTROL = "Control"
}
export interface TemplateProps {
    layout: ElementLayout;
}
export interface VerticalTemplateProps extends TemplateProps {
    grid: boolean;
}
export interface VerticalTemplates<CP extends VerticalTemplateProps = VerticalTemplateProps> {
    [key: string]: Component<CP>;
}
export interface HorizontalTemplateProps extends TemplateProps {
    grid: boolean;
    flex: boolean;
}
export interface HorizontalTemplates<CP extends HorizontalTemplateProps = HorizontalTemplateProps> {
    [key: string]: Component<CP>;
}
export interface ArrayTemplateProps extends TemplateProps {
    subSchema: JSONSchema7Type;
}
export interface ArrayTemplates<CP extends ArrayTemplateProps = ArrayTemplateProps> {
    [key: string]: Component<CP>;
}
export interface ControlTemplateProps extends TemplateProps {
    formDisabled: boolean | undefined;
    field: FieldStore<any, any>;
    subSchema: JSONSchema7Type;
}
export interface ControlTemplates<CP extends ControlTemplateProps = ControlTemplateProps> {
    [key: string]: Component<CP>;
}
export interface Templates<V, H, A, C> {
    [TemplateType.VERTICAL_LAYOUT]?: V;
    [TemplateType.HORIZONTAL_LAYOUT]?: H;
    [TemplateType.ARRAY]?: A;
    [TemplateType.CONTROL]?: C;
}
export interface DefaultVerticalTemplates<CP extends VerticalTemplateProps = VerticalTemplateProps> {
    defaultVertical: Component<CP>;
}
export interface DefaultHorizontalTemplates<CP extends HorizontalTemplateProps = HorizontalTemplateProps> {
    defaultHorizontal: Component<CP>;
}
export interface DefaultArrayTemplates<CP extends ArrayTemplateProps = ArrayTemplateProps> {
    defaultArray: Component<CP>;
}
export interface DefaultControlTemplates<CP extends ControlTemplateProps = ControlTemplateProps> {
    defaultControl: Component<CP>;
}
export interface DefaultTemplates {
    [TemplateType.VERTICAL_LAYOUT]: DefaultVerticalTemplates;
    [TemplateType.HORIZONTAL_LAYOUT]: DefaultHorizontalTemplates;
    [TemplateType.ARRAY]: DefaultArrayTemplates;
    [TemplateType.CONTROL]: DefaultControlTemplates;
}
