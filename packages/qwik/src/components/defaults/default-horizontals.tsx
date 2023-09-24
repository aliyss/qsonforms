import { Slot, component$ } from "@builder.io/qwik";
import type { HorizontalTemplateProps } from "../../types";

export const DefaultHorizontal = component$<HorizontalTemplateProps>(
  ({ layout }) => {
    return (
      <>
        <div
          class={`form-horizontal ${
            layout["ui:class"] || "form-horizontal-default"
          }`}
        >
          <Slot />
        </div>
      </>
    );
  },
);
