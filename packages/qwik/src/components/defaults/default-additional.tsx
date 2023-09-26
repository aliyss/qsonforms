import { component$ } from "@builder.io/qwik";
import type {
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
