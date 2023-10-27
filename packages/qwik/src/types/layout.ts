import { QRL } from "@builder.io/qwik";
import type {
  ArrayTemplates,
  ControlTemplates,
  DefaultArrayTemplates,
  DefaultControlTemplates,
  DefaultHorizontalTemplates,
  DefaultVerticalTemplates,
  HorizontalTemplates,
  TemplateType,
  VerticalTemplates,
} from "./tempates";
import type { ControlWidgets, DefaultControlWidgets } from "./widgets";
import { TransformField } from "./field";
import { FieldPathValue } from "./path";

export interface ElementLayout {
  type: TemplateType;
  "ui:options"?: Record<string, any>;
  "ui:title"?: string | boolean;
  "ui:description"?: string;
  "ui:class"?: string;
  "ui:disabled"?: boolean;
}

interface ViewLayout<V, H, A, C, W> extends ElementLayout {
  elements: Layout<V, H, A, C, W>[];
}

export interface VerticalLayout<V, H, A, C, W>
  extends ViewLayout<V, H, A, C, W> {
  type: TemplateType.VERTICAL_LAYOUT;
  "ui:template"?: keyof (V & DefaultVerticalTemplates);
}

export interface HorizontalLayout<V, H, A, C, W>
  extends ViewLayout<V, H, A, C, W> {
  type: TemplateType.HORIZONTAL_LAYOUT;
  "ui:template"?: keyof (H & DefaultHorizontalTemplates);
}

export interface ArrayLayout<V, H, A, C, W> extends ElementLayout {
  type: TemplateType.ARRAY;
  scope: string;
  "ui:template"?: keyof (A & DefaultArrayTemplates);
  "ui:items"?: Layout<V, H, A, C, W>;
}

export interface ControlElement<C, W> extends ElementLayout {
  type: TemplateType.CONTROL;
  transform?: QRL<TransformField<FieldPathValue<any, any>>> | undefined;
  scope: string;
  "ui:template"?: keyof (C & DefaultControlTemplates);
  "ui:widget"?: keyof (W & DefaultControlWidgets);
  "ui:widget:class"?: string;
}

export type Layout<V, H, A, C, W> =
  | VerticalLayout<V, H, A, C, W>
  | HorizontalLayout<V, H, A, C, W>
  | ArrayLayout<V, H, A, C, W>
  | ControlElement<C, W>;

export type UiLayout<
  V extends VerticalTemplates | DefaultVerticalTemplates =
    | VerticalTemplates
    | DefaultVerticalTemplates,
  H extends HorizontalTemplates | DefaultHorizontalTemplates =
    | HorizontalTemplates
    | DefaultHorizontalTemplates,
  A extends ArrayTemplates | DefaultArrayTemplates =
    | ArrayTemplates
    | DefaultArrayTemplates,
  C extends ControlTemplates | DefaultControlTemplates =
    | ControlTemplates
    | DefaultControlTemplates,
  W extends ControlWidgets | DefaultControlWidgets =
    | ControlWidgets
    | DefaultControlWidgets,
> = Layout<V, H, A, C, W>;
