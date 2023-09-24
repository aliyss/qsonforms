import { Slot, component$ } from "@builder.io/qwik";
import type { VerticalTemplateProps } from "../../types";

export const DefaultVertical = component$<VerticalTemplateProps>(
  ({ layout }) => {
    return (
      <>
        <div
          class={`form-vertical ${
            layout["ui:class"] || "form-vertical-default"
          }`}
        >
          <Slot />
        </div>
      </>
    );
  },
);
