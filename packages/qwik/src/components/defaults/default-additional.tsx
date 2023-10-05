import { Slot, component$ } from "@builder.io/qwik";
import type {
  DefaultArrayItemTemplateProps,
  DefaultFieldTemplateProps,
  ErrorTemplateProps,
} from "../../types";

export const DefaultError = component$<ErrorTemplateProps>(({ errors }) => {
  return (
    <>
      <div style="color: red;">
        {errors && errors.length > 0 ? errors[0].message : <></>}
      </div>
    </>
  );
});

export const DefaultTitle = component$<DefaultFieldTemplateProps>(
  ({ subSchema, required, layout }) => {
    const title = layout["ui:title"] || subSchema.title;
    return (
      <>{title ? <span>{`${title}${required ? "*" : ""}`}</span> : <></>}</>
    );
  },
);

export const DefaultArrayTitle = component$<DefaultFieldTemplateProps>(
  ({ subSchema, required, layout }) => {
    const title = layout["ui:title"] || subSchema.title;
    return (
      <>{title ? <span>{`${title}${required ? "*" : ""}`}</span> : <></>}</>
    );
  },
);

export const DefaultArrayItem = component$<DefaultArrayItemTemplateProps>(
  ({ itemPath, subSchema, layout, isUniqueEnum }) => {
    const title = isUniqueEnum
      ? ""
      : (layout["ui:title"] || subSchema.title) +
        ` - ${itemPath.split(".")[itemPath.split(".").length - 1]}`;

    return (
      <div
        class={`form-array-item ${
          isUniqueEnum ? "form-uniqueitem-enum-array-item" : ""
        }`}
      >
        <>{title ? <span>{`${title}`}</span> : <></>}</>
        <Slot />
        <Slot name="remove-button" />
      </div>
    );
  },
);
