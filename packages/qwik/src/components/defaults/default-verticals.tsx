import { Slot, component$ } from "@builder.io/qwik";
import { VerticalTemplateProps } from "../templates";

export const DefaultVertical = component$<VerticalTemplateProps>(() => {
  return (
    <>
      <div class="form-vertical-default">
        <Slot />
      </div>
    </>
  );
});
