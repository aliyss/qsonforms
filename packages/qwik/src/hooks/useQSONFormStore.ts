/*
MIT License

Copyright (c) 2022 Fabian Hiller

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import { useStore } from "@builder.io/qwik";
import type { FormOptions, FormStore, FromData, ResponseData } from "../types";
import { getInitialStores } from "../utils";

/**
 * Creates and returns the store of the form.
 *
 * TODO: Add initialValues option beside loader
 *
 * @param options The form options.
 *
 * @returns The reactive store.
 */
export function useQSONFormStore<
  T,
  S,
  TResponseData extends ResponseData<FromData<S>> = undefined,
>(
  schema: T,
  {
    validate,
    validateOn = "submit",
    revalidateOn = "input",
    hideSubmitButton = undefined,
    ...options
  }: FormOptions<FromData<S>, TResponseData>,
): FormStore<T, FromData<S>, TResponseData> {
  return useStore(() => {
    const [fields] = getInitialStores(options);
    return {
      internal: {
        fields,
        validate,
        validators: [],
        validateOn,
        revalidateOn,
        hideSubmitButton,
      },
      schema,
      uiSchema: options.uiSchema,
      // FIXME: Set state based on `action`
      emptyIsUndefined: options.emptyIsUndefined,
      element: undefined,
      submitCount: 0,
      submitting: false,
      submitted: false,
      validating: false,
      touched: false,
      dirty: false,
      invalid: false,
      response: options.action?.value?.response || {},
    };
  });
}
