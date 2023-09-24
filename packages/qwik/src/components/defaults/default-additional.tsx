import { component$ } from "@builder.io/qwik";
import type { ErrorTemplateProps } from "../../types";

export const DefaultError = component$<ErrorTemplateProps>(({ errors }) => {
  return (
    <>
      <div style="color: red;">
        {errors && errors.length > 0 ? errors[0].message : <></>}
      </div>
    </>
  );
});
