/*
MIT License

Copyright (c) 2022 Fabian Hiller

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import { type QwikSubmitEvent } from "@builder.io/qwik";
import type { ActionStore } from "@builder.io/qwik-city";
import type { JSX } from "@builder.io/qwik/jsx-runtime";
// import { FormError } from "../exceptions";
import { getValues, setResponse, validate } from "../methods";
import type {
  FormActionStore,
  FormStore,
  FromData,
  ResponseData,
} from "../types";
import { JSONSchema7 } from "json-schema";
import { SchemaParser } from "./SchemaParser";

/**
 * Function type to handle the submission of the form.
 */
export type SubmitHandler<T> = (
  values: T,
  event: QwikSubmitEvent<HTMLFormElement>,
) => Promise<any> | undefined;

/**
 * Value type of the form properties.
 */
export type FormProps<T, TResponseData extends ResponseData<T>> = {
  // Custom props
  of: FormStore<T, TResponseData>;
  action?:
    | ActionStore<FormActionStore<T, TResponseData>, Partial<T>, true>
    | undefined;
  onSubmit$?: SubmitHandler<T> | undefined;
  responseDuration?: number | undefined;
  keepResponse?: boolean | undefined;
  shouldActive?: boolean | undefined;
  shouldTouched?: boolean | undefined;
  shouldDirty?: boolean | undefined;
  shouldFocus?: boolean | undefined;
  reloadDocument?: boolean | undefined;

  // HTML props
  id?: string | undefined;
  class?: string | undefined;
  autoComplete?: "on" | "off" | undefined;
  encType?:
    | "application/x-www-form-urlencoded"
    | "multipart/form-data"
    | undefined;
  name?: string | undefined;
};

/**
 * Form element that takes care of validation and simplifies submission.
 */
export function QJSONForm<
  T extends JSONSchema7,
  TResponseData extends ResponseData<FromData<T>>,
>({
  of: form,
  action,
  onSubmit$,
  responseDuration: duration,
  keepResponse,
  shouldActive,
  shouldTouched,
  shouldDirty,
  shouldFocus,
  reloadDocument,
  ...formProps
}: FormProps<FromData<T>, TResponseData>): JSX.Element {
  // Destructure form props
  const { encType } = formProps;

  // Create options object
  const options = {
    duration,
    shouldActive,
    shouldTouched,
    shouldDirty,
    shouldFocus,
  };

  return (
    <form
      noValidate
      {...formProps}
      method="post"
      action={action?.actionPath}
      preventdefault:submit={!reloadDocument}
      ref={(element: Element) => {
        form.element = element as HTMLFormElement;
      }}
      onSubmit$={async (event: QwikSubmitEvent<HTMLFormElement>, element) => {
        // Reset response if it is not to be kept
        if (!keepResponse) {
          form.response = {};
        }

        // Increase submit count and set submitted and submitting to "true"
        form.submitCount++;
        form.submitted = true;
        form.submitting = true;

        // Try to run submit actions if form is valid
        try {
          if (await validate(form, options)) {
            // Get current values of form
            const values = getValues(form, options);

            // Run submit actions of form
            const [actionResult] = await Promise.all([
              !reloadDocument
                ? // eslint-disable-next-line qwik/valid-lexical-scope
                  action?.submit(encType ? new FormData(element) : values)
                : undefined,
              // eslint-disable-next-line qwik/valid-lexical-scope
              onSubmit$?.(values as FromData<T>, event),
            ]);

            // Set form action result if necessary
            if (actionResult?.value) {
              const { response } = actionResult.value;
              // setFieldErrors(form, errors, { ...options, shouldFocus: false });
              if (Object.keys(response).length) {
                setResponse(form, response, options);
              } else {
                // setErrorResponse(form, errors, options);
              }
            }
          }

          // If an error occurred, set error to fields and response
        } catch (error: any) {
          // if (error) {
          //   // setFieldErrors(form, error.errors, {
          //   //   ...options,
          //   //   shouldFocus: false,
          //   // });
          // }
          // if (!(error instanceof FormError) || error.message) {
          if (error.message) {
            setResponse(
              form,
              {
                status: "error",
                message: error?.message || "An unknown error has occurred.",
              },
              options,
            );
          }

          // Finally set submitting back to "false"
        } finally {
          form.submitting = false;
        }
      }}
    >
      <SchemaParser
        layout={form.uiSchema.layout}
        templates={form.uiSchema.templates}
        formData={form}
      />
      <button type="submit">Test</button>
    </form>
  );
}
