import { Slot, component$ } from "@builder.io/qwik";
import type { ButtonTemplateProps } from "../../types";

export const DefaultButton = component$<ButtonTemplateProps>(({ props }) => {
  return (
    <>
      <button {...props}>
        <Slot />
      </button>
    </>
  );
});

export const DefaultSubmitButton = component$<ButtonTemplateProps>(
  ({ props }) => {
    return (
      <>
        <button {...props}>
          <Slot />
        </button>
      </>
    );
  },
);
