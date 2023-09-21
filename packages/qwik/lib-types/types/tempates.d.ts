import { Component } from "@builder.io/qwik";
import { ElementLayout } from "./layout";
import { JSONSchema7Type } from "json-schema";
export declare enum TemplateType {
    CONTROL = "Control",
    HORIZONTAL_LAYOUT = "HorizontalLayout",
    VERTICAL_LAYOUT = "VerticalLayout"
}
export interface TemplateProps {
    layout: ElementLayout;
}
export interface ControlTemplateProps extends TemplateProps {
    subSchema: JSONSchema7Type;
}
export interface ControlTemplates<CP extends ControlTemplateProps = ControlTemplateProps> {
    [key: string]: Component<CP>;
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
export interface Templates<V, H, C> {
    [TemplateType.VERTICAL_LAYOUT]?: V;
    [TemplateType.HORIZONTAL_LAYOUT]?: H;
    [TemplateType.CONTROL]?: C;
}
export interface DefaultControlTemplates<CP extends ControlTemplateProps = ControlTemplateProps> {
    defaultControl: Component<CP>;
}
export interface DefaultVerticalTemplates<CP extends VerticalTemplateProps = VerticalTemplateProps> {
    defaultVertical: Component<CP>;
}
export interface DefaultHorizontalTemplates<CP extends HorizontalTemplateProps = HorizontalTemplateProps> {
    defaultHorizontal: Component<CP>;
}
export interface DefaultTemplates {
    [TemplateType.VERTICAL_LAYOUT]: DefaultVerticalTemplates;
    [TemplateType.HORIZONTAL_LAYOUT]: DefaultHorizontalTemplates;
    [TemplateType.CONTROL]: DefaultControlTemplates;
}
