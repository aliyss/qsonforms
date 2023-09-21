import { DefaultTemplates, DefaultWidgets, TemplateType } from "../../types";
import { DefaultVertical } from "../../components/defaults/default-verticals";
import { DefaultHorizontal } from "../../components/defaults/default-horizontals";
import { DefaultControl } from "../../components/defaults/default-controls";
import {
  DefaultBooleanWidget,
  DefaultControlWidget,
  DefaultNumberWidget,
  DefaultStringWidget,
} from "../../components/defaults/default-control-widgets";

export const defaultTemplates: DefaultTemplates = {
  [TemplateType.VERTICAL_LAYOUT]: { defaultVertical: DefaultVertical },
  [TemplateType.HORIZONTAL_LAYOUT]: { defaultHorizontal: DefaultHorizontal },
  [TemplateType.CONTROL]: { defaultControl: DefaultControl },
};

export const defaultWidgets: DefaultWidgets = {
  [TemplateType.CONTROL]: {
    defaultControl: DefaultControlWidget,
    string: DefaultStringWidget,
    boolean: DefaultBooleanWidget,
    number: DefaultNumberWidget,
  },
};
