import { Slot, component$ } from "@builder.io/qwik";
import type { ControlTemplateProps } from "../../types";

export const DefaultControl = component$<ControlTemplateProps>(({ layout }) => {
  return (
    <>
      <div
        class={`form-control ${layout["ui:class"] || "form-control-default"}`}
      >
        <Slot name="title" />
        <Slot />
        <Slot name="errors" />
      </div>
    </>
  );
});
