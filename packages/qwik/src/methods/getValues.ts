/*
MIT License

Copyright (c) 2022 Fabian Hiller

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import type { FormStore, ResponseData, FieldPath } from "../types";
import { getFieldStore, getFilteredNames, getOptions } from "../utils";

export type GetValuesOptions = Partial<{
  shouldActive: boolean;
  shouldTouched: boolean;
  shouldDirty: boolean;
  shouldValid: boolean;
}>;

export function getValues<S, T, TResponseData extends ResponseData<T>>(
  form: FormStore<S, T, TResponseData>,
  options?: GetValuesOptions | undefined,
): Partial<T>;

export function getValues<S, T, TResponseData extends ResponseData<T>>(
  form: FormStore<S, T, TResponseData>,
  names: FieldPath<T>[],
  options?: GetValuesOptions | undefined,
): Partial<T>;

export function getValues<S, T, TResponseData extends ResponseData<T>>(
  form: FormStore<S, T, TResponseData>,
  arg2?: FieldPath<T>[] | GetValuesOptions | undefined,
  arg3?: GetValuesOptions | undefined,
): Partial<T> {
  // Destructure options and set default values
  const {
    shouldActive = true,
    shouldTouched = false,
    shouldDirty = false,
    shouldValid = false,
  } = getOptions(arg2, arg3);

  // Create and return values of form or field array
  return getFilteredNames(form, arg2)[0].reduce<any>(
    (values, name) => {
      // Get store of specified field
      const field = getFieldStore(form, name)!;

      // Add value if field corresponds to filter options
      if (
        (!shouldActive || field.active) &&
        (!shouldTouched || field.touched) &&
        (!shouldDirty || field.dirty) &&
        (!shouldValid || !field.error) &&
        (!field.isUniqueEnum || (field.isUniqueEnum && field.value))
      ) {
        // Split name into keys to be able to add values of nested fields
        // @ts-ignore
        (typeof arg2 === "string" ? name.replace(`${arg2}.`, "") : name)
          .split(".")
          .reduce<any>((object: any, key: any, index: any, keys: any) => {
            if (field.isUniqueEnum && Array.isArray(object)) {
              key = object.length;
            }
            return (object[key] =
              index === keys.length - 1
                ? // If it is last key, add value
                  Number.isNaN(field.value)
                  ? undefined
                  : field.value
                : // Otherwise return object or array
                  (typeof object[key] === "object" && object[key]) ||
                  (isNaN(+keys[index + 1]) ? {} : []));
          }, values);
      }
      // Return modified values object
      return values;
    },
    typeof arg2 === "string" ? [] : {},
  );
}
