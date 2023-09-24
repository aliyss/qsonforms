import type {
  DefaultArrayTemplates,
  DefaultControlTemplates,
  DefaultHorizontalTemplates,
  DefaultVerticalTemplates,
  TemplateType,
} from "./tempates";
import type { DefaultControlWidgets } from "./widgets";

export interface ElementLayout {
  type: TemplateType;
  "ui:options"?: Record<string, any>;
  "ui:class"?: string;
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
