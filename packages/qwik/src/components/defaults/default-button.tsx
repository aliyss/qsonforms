import { Slot, component$ } from "@builder.io/qwik";
import { ButtonTemplateProps } from "../../types";

export const DefaultButton = component$<ButtonTemplateProps>(({ props }) => {
  return (
    <>
      <button {...props}>
        <Slot />
      </button>
    </>
  );
});
