import { AdditionalTemplateType, TemplateType } from "../../types";
import type {
  DefaultAdditionals,
  DefaultTemplates,
  DefaultWidgets,
} from "../../types";
import { DefaultVertical } from "../../components/defaults/default-verticals";
import { DefaultHorizontal } from "../../components/defaults/default-horizontals";
import { DefaultControl } from "../../components/defaults/default-controls";
import {
  DefaultBooleanWidget,
  DefaultControlWidget,
  DefaultNumberWidget,
  DefaultSelectWidget,
  DefaultStringWidget,
  DefaultUniqueItemEnumWidget,
} from "../../components/defaults/default-control-widgets";
import { DefaultArray } from "../../components/defaults/default-array";
import {
  DefaultButton,
  DefaultSubmitButton,
} from "../../components/defaults/default-button";
import {
  DefaultError,
  DefaultTitle,
} from "../../components/defaults/default-additional";

export const defaultTemplates: DefaultTemplates = {
  [TemplateType.VERTICAL_LAYOUT]: { defaultVertical: DefaultVertical },
  [TemplateType.HORIZONTAL_LAYOUT]: { defaultHorizontal: DefaultHorizontal },
  [TemplateType.ARRAY]: { defaultArray: DefaultArray },
  [TemplateType.CONTROL]: { defaultControl: DefaultControl },
};

export const defaultAdditionals: DefaultAdditionals = {
  [AdditionalTemplateType.BUTTON]: {
    addButton: DefaultButton,
    removeButton: DefaultButton,
    moveUpButton: DefaultButton,
    moveDownButton: DefaultButton,
    submitButton: DefaultSubmitButton,
  },
  [AdditionalTemplateType.ERROR]: {
    defaultError: DefaultError,
  },
  [AdditionalTemplateType.FIELD]: {
    defaultTitle: DefaultTitle,
  },
};

export const defaultWidgets: DefaultWidgets = {
  [TemplateType.CONTROL]: {
    defaultControl: DefaultControlWidget,
    string: DefaultStringWidget,
    boolean: DefaultBooleanWidget,
    number: DefaultNumberWidget,
    integer: DefaultNumberWidget,
    enum: DefaultSelectWidget,
    uniqueItemEnum: DefaultUniqueItemEnumWidget,
  },
};
