import { Slot, component$ } from "@builder.io/qwik";
import { ControlTemplateProps } from "../templates";

export const DefaultControl = component$<ControlTemplateProps>(() => {
  return (
    <>
      <div class="form-control-default">
        <Slot />
      </div>
    </>
  );
});
