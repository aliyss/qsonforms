/*
MIT License

Copyright (c) 2022 Fabian Hiller

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import type {
  ResponseData,
  FormStore,
  FieldPath,
  FieldPathValue,
} from "../types";
import {
  getFilteredNames,
  getOptions,
  getFieldStore,
  getPathValue,
  updateFormState,
} from "../utils";

/**
 * Value type of the reset options.
 */
export type ResetOptions<T, TFieldName extends FieldPath<T>> = Partial<{
  initialValue: FieldPathValue<T, TFieldName>;
  initialValues: Partial<T>;
  keepResponse: boolean;
  keepSubmitCount: boolean;
  keepSubmitted: boolean;
  keepValues: boolean;
  keepDirtyValues: boolean;
  keepItems: boolean;
  keepDirtyItems: boolean;
  keepErrors: boolean;
  keepTouched: boolean;
  keepDirty: boolean;
}>;

/**
 * Resets the entire form, several fields and field arrays or a singel field or
 * field array.
 *
 * @param form The form to be reset.
 * @param options The reset options.
 */
export function reset<S, T, TResponseData extends ResponseData<T>>(
  form: FormStore<S, T, TResponseData>,
  options?: ResetOptions<T, FieldPath<T>> | undefined,
): void;

/**
 * Resets the entire form, several fields and field arrays or a singel field or
 * field array.
 *
 * @param form The form to be reset.
 * @param name The field or field array to be reset.
 * @param options The reset options.
 */
export function reset<
  S,
  T,
  TResponseData extends ResponseData<T>,
  TFieldName extends FieldPath<T>,
>(
  form: FormStore<S, T, TResponseData>,
  name: TFieldName,
  options?: ResetOptions<T, TFieldName> | undefined,
): void;

/**
 * Resets the entire form, several fields and field arrays or a singel field or
 * field array.
 *
 * @param form The form to be reset.
 * @param names The fields and field arrays to be reset.
 * @param options The reset options.
 */
export function reset<S, T, TResponseData extends ResponseData<T>>(
  form: FormStore<S, T, TResponseData>,
  names: FieldPath<T>[],
  options?: ResetOptions<T, FieldPath<T>> | undefined,
): void;

export function reset<
  S,
  T,
  TResponseData extends ResponseData<T>,
  TFieldName extends FieldPath<T>,
>(
  form: FormStore<S, T, TResponseData>,
  arg2?: TFieldName | FieldPath<T>[] | ResetOptions<T, TFieldName> | undefined,
  arg3?: ResetOptions<T, TFieldName> | undefined,
): void {
  // Filter names between field and field arrays
  const [fieldNames] = getFilteredNames(form, arg2, false);

  // Check if only a single field should be reset
  const resetSingleField = typeof arg2 === "string" && fieldNames.length === 1;

  // Check if entire form should be reset
  const resetEntireForm = !resetSingleField && !Array.isArray(arg2);

  // Get options object
  const options = getOptions(arg2, arg3);

  // Destructure options and set default values
  const {
    initialValue,
    initialValues,
    keepResponse = false,
    keepSubmitCount = false,
    keepSubmitted = false,
    keepValues = false,
    keepDirtyValues = false,
    keepErrors = false,
    keepTouched = false,
    keepDirty = false,
  } = options;

  // Reset state of each field
  fieldNames.forEach((name) => {
    // Get store of specified field
    const field = getFieldStore(form, name)!;

    // Reset initial value if necessary
    if (resetSingleField ? "initialValue" in options : initialValues) {
      field.internal.initialValue = resetSingleField
        ? initialValue
        : getPathValue(name, initialValues!);
    }

    // Check if dirty value should be kept
    const keepDirtyValue = keepDirtyValues && field.dirty;

    // Reset input if it is not to be kept
    if (!keepValues && !keepDirtyValue) {
      field.internal.startValue = field.internal.initialValue;
      field.value = field.internal.initialValue;

      // Reset file inputs manually, as they can't be controlled
      field.internal.elements.forEach((element) => {
        if (element.type === "file") {
          element.value = "";
        }
      });
    }

    // Reset touched if it is not to be kept
    if (!keepTouched) {
      field.touched = false;
    }

    // Reset dirty if it is not to be kept
    if (!keepDirty && !keepValues && !keepDirtyValue) {
      field.dirty = false;
    }

    // Reset error if it is not to be kept
    if (!keepErrors) {
      field.error = [];
    }
  });

  // Reset state of form if necessary
  if (resetEntireForm) {
    // Reset response if it is not to be kept
    if (!keepResponse) {
      form.response = {};
    }

    // Reset submit count if it is not to be kept
    if (!keepSubmitCount) {
      form.submitCount = 0;
    }

    // Reset submitted if it is not to be kept
    if (!keepSubmitted) {
      form.submitted = false;
    }
  }

  // Update touched, dirty and invalid state of form
  updateFormState(form);
}
