import { Component } from "@builder.io/qwik";
import { ElementLayout } from "./layout";
import { JSONSchema7Type } from "json-schema";
import { TemplateType } from "./tempates";
import { FieldElementProps } from "../components/Field";

export enum WidgetType {
  CONTROL = "Control",
}

export interface WidgetProps {
  layout: ElementLayout & {
    "ui:widget:class"?: string;
  };
}

export interface ControlWidgetProps<I = any> extends WidgetProps {
  subSchema: JSONSchema7Type;
  initialData: I;
  additionalProps: FieldElementProps<any, any>;
}

export interface ControlWidgets<
  CP extends ControlWidgetProps = ControlWidgetProps,
> {
  [key: string]: Component<CP>;
}

export interface Widgets<C> {
  [WidgetType.CONTROL]?: C;
}

/*
 *  Default Widgets
 */
export interface DefaultControlWidgets<
  CP extends ControlWidgetProps = ControlWidgetProps,
> {
  defaultControl: Component<CP>;
  string: Component<CP>;
  boolean: Component<CP>;
  number: Component<CP>;
}

export interface DefaultWidgets {
  [TemplateType.CONTROL]: DefaultControlWidgets;
}
