/*
MIT License

Copyright (c) 2022 Fabian Hiller

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import { setResponse, type SetResponseOptions } from "../methods";
import type { FormErrors, FormStore, ResponseData } from "../types";

/**
 * Value type of the error response options.
 */
type ErrorResponseOptions = SetResponseOptions &
  Partial<{
    shouldActive: boolean;
  }>;

/**
 * Sets an error response if a form error was not set at any field or field
 * array.
 *
 * @param form The form of the errors.
 * @param formErrors The form errors.
 * @param options The error options.
 */
export function setErrorResponse<T, TResponseData extends ResponseData<T>>(
  form: FormStore<T, TResponseData>,
  formErrors: FormErrors,
  { duration, shouldActive = true }: ErrorResponseOptions,
): void {
  // Combine errors that were not set for any field or field array into one
  // general form error response message
  // const message = formErrors
  //   .reduce<string[]>((errors, [name, error]) => {
  //     if (
  //       [
  //         getFieldStore(form, name as FieldPath<T>),
  //         getFieldArrayStore(form, name as FieldArrayPath<T>),
  //       ].every(
  //         (fieldOrFieldArray) =>
  //           !fieldOrFieldArray || (shouldActive && !fieldOrFieldArray.active),
  //       )
  //     ) {
  //       errors.push(error!);
  //     }
  //     return errors;
  //   }, [])
  //   .join(" ");

  // If there is a error message, set it as form response
  const message = "";
  if (message) {
    setResponse(form, { status: "error", message }, { duration });
  }
}
