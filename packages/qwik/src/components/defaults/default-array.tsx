import { Slot, component$ } from "@builder.io/qwik";
import { ArrayTemplateProps } from "../../types";

export const DefaultArray = component$<ArrayTemplateProps>(({ layout }) => {
  return (
    <>
      <div class={`form-array ${layout["ui:class"] || "form-array-default"}`}>
        <Slot />
        <Slot name="add-button" />
      </div>
    </>
  );
});
