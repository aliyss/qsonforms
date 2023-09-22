import { Component } from "@builder.io/qwik";
import { ElementLayout } from "./layout";
import { JSONSchema7Type } from "json-schema";
import { TemplateType } from "./tempates";
import { FieldElementProps } from "../components/Field";
import { FieldStore } from "./field";
export declare enum WidgetType {
    CONTROL = "Control"
}
export interface WidgetProps {
    layout: ElementLayout & {
        "ui:widget:class"?: string;
    };
}
export interface ControlWidgetProps<I = FieldStore<any, any>> extends WidgetProps {
    subSchema: JSONSchema7Type;
    field: I;
    additionalProps: FieldElementProps<any, any>;
}
export interface ControlWidgets<CP extends ControlWidgetProps = ControlWidgetProps> {
    [key: string]: Component<CP>;
}
export interface Widgets<C> {
    [WidgetType.CONTROL]?: C;
}
export interface DefaultControlWidgets<CP extends ControlWidgetProps = ControlWidgetProps> {
    defaultControl: Component<CP>;
    string: Component<CP>;
    boolean: Component<CP>;
    number: Component<CP>;
}
export interface DefaultWidgets {
    [TemplateType.CONTROL]: DefaultControlWidgets;
}
