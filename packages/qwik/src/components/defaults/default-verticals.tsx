import { Slot, component$ } from "@builder.io/qwik";
import { VerticalTemplateProps } from "../../types";

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
