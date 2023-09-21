import { Slot, component$ } from "@builder.io/qwik";
import { HorizontalTemplateProps } from "../../types";

export const DefaultHorizontal = component$<HorizontalTemplateProps>(() => {
  return (
    <>
      <div class="form-horizontal-default">
        <Slot />
      </div>
    </>
  );
});
