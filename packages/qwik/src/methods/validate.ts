/*
MIT License

Copyright (c) 2022 Fabian Hiller

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import type {
  FormError,
  ResponseData,
  FormStore,
  FieldPath,
  FormErrors,
} from "../types";

import {
  getFilteredNames,
  getOptions,
  getUniqueId,
  getFieldStore,
  setErrorResponse,
  updateFormInvalid,
} from "../utils";
import { focus } from "./focus";
import { getValues } from "./getValues";

/**
 * Value type of the validate options.
 */
export type ValidateOptions = Partial<{
  shouldActive: boolean;
  shouldFocus: boolean;
}>;

/**
 * Validates the entire form.
 *
 * @param form The form to be validated.
 * @param options The validation options.
 *
 * @returns Whether the fields are valid.
 */
export async function validate<T, TResponseData extends ResponseData<T>>(
  form: FormStore<T, TResponseData>,
  options?: ValidateOptions | undefined,
): Promise<boolean>;

/**
 * Validates a single field or field array.
 *
 * @param form The form to be validated.
 * @param name The field or field array to be validated.
 * @param options The validation options.
 *
 * @returns Whether the fields are valid.
 */
export async function validate<T, TResponseData extends ResponseData<T>>(
  form: FormStore<T, TResponseData>,
  name: FieldPath<T>,
  options?: ValidateOptions | undefined,
): Promise<boolean>;

/**
 * Validates several fields and field arrays.
 *
 * @param form The form to be validated.
 * @param names The fields and field arrays to be validated.
 * @param options The validation options.
 *
 * @returns Whether the fields are valid.
 */
export async function validate<T, TResponseData extends ResponseData<T>>(
  form: FormStore<T, TResponseData>,
  names: FieldPath<T>[],
  options?: ValidateOptions | undefined,
): Promise<boolean>;

export async function validate<T, TResponseData extends ResponseData<T>>(
  form: FormStore<T, TResponseData>,
  arg2?: FieldPath<T> | FieldPath<T>[] | ValidateOptions | undefined,
  arg3?: ValidateOptions | undefined,
): Promise<boolean> {
  // Filter names between field and field arrays
  const [fieldNames] = getFilteredNames(form, arg2);

  // Destructure options and set default values
  const { shouldActive = true, shouldFocus = true } = getOptions(arg2, arg3);

  // Create unique validator ID and add it to list
  const validator = getUniqueId();
  form.internal.validators.push(validator);

  // Set validating to "true"
  form.validating = true;

  // Run form validation function
  const formErrors: FormErrors = form.internal.validate
    ? await form.internal.validate(getValues(form, { shouldActive }))
    : [];

  // Create valid variable
  let valid =
    typeof arg2 !== "string" && !Array.isArray(arg2)
      ? !formErrors?.length
      : true;

  if (!formErrors) {
    return true;
  }

  const fieldPaths = formErrors.reduce(
    (result: any, item: any) => {
      let fieldSchemaPath = item.instancePath;
      if (item.keyword === "required") {
        fieldSchemaPath = `${item.instancePath}/${item.params.missingProperty}`;
      }
      const fieldPath = fieldSchemaPath.replace(/\//g, ".").slice(1);
      if (!result[fieldPath]) {
        result[fieldPath] = [];
      }
      result[fieldPath].push(item);
      return result;
    },
    {} as { [key: string]: FormError[] },
  );

  const [errorFields] = await Promise.all([
    // Validate each field in list
    Promise.all(
      fieldNames.map(async (name) => {
        // Get store of specified field
        const field = getFieldStore(form, name)!;

        // Continue if field corresponds to filter options
        if (!shouldActive || field.active) {
          // Create local error variable
          let fieldError = false;

          if (fieldPaths[name]) {
            field.error = fieldPaths[name];
            fieldError = true;
          } else {
            field.error = [];
          }

          // Create field error from local and global error

          // Set valid to "false" if an error occurred
          if (fieldError) {
            valid = false;
          }

          // Return name if field has an error
          return fieldError ? name : null;
        }
      }),
    ),
  ]);

  // Set error response if necessary
  setErrorResponse(form, formErrors, { shouldActive });

  // Focus first field with an error if specified
  if (shouldFocus) {
    const name = errorFields.find((name) => name);
    if (name) {
      focus(form, name);
    }
  }

  // Update invalid state of form
  updateFormInvalid(form, !valid);

  // Delete validator from list
  form.internal.validators.splice(
    form.internal.validators.indexOf(validator),
    1,
  );

  // Set validating to "false" if there is no other validator
  if (!form.internal.validators.length) {
    form.validating = false;
  }

  // Return whether fields are valid
  return valid;
}
