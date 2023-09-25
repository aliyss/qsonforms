/*
MIT License

Copyright (c) 2022 Fabian Hiller

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import type { FormResponse, FormStore, ResponseData } from "../types";

/**
 * Value type of the set response options.
 */
export type SetResponseOptions = Partial<{
  duration: number;
}>;

/**
 * Sets the response of the form.
 *
 * @param form The form of the response.
 * @param response The response object.
 * @param options The response options.
 */
export function setResponse<S, T, TResponseData extends ResponseData<T>>(
  form: FormStore<S, T, TResponseData>,
  response: FormResponse<TResponseData>,
  { duration }: SetResponseOptions | undefined = {},
): void {
  // Set new response
  form.response = response;

  // If necessary, remove new response after specified duration if response has
  // not been changed in meantime
  if (duration) {
    setTimeout(() => {
      if (form.response === response) {
        form.response = {};
      }
    }, duration);
  }
}
