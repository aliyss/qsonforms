import { Slot, component$ } from "@builder.io/qwik";
import { ControlTemplateProps } from "../../types";

export const DefaultControl = component$<ControlTemplateProps>(() => {
  return (
    <>
      <div class="form-control-default">
        <Slot />
      </div>
    </>
  );
});
