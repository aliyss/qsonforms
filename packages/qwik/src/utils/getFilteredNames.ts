/*
MIT License

Copyright (c) 2022 Fabian Hiller

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import { FieldPath, FormStore, ResponseData } from "../types";
import { getFieldNames } from "./getFieldNames";

export function getFilteredNames<
  T,
  TResponseData extends ResponseData<T>,
  TOptions extends Record<string, any>,
>(
  form: FormStore<T, TResponseData>,
  arg2?: FieldPath<T> | FieldPath<T>[] | TOptions | undefined,
  shouldValid?: boolean | undefined,
): [FieldPath<T>[]] {
  // Get all field and field array names of form
  const allFieldNames = getFieldNames(form, shouldValid);

  // If names are specified, filter and return them
  if (typeof arg2 === "string" || Array.isArray(arg2)) {
    return (typeof arg2 === "string" ? [arg2] : arg2)
      .reduce(
        (tuple, name) => {
          // Destructure tuple
          const [fieldNames] = tuple;

          // If it is name of a field array, add it and name of each field
          // and field array it contains to field and field array names
          fieldNames.add(name as FieldPath<T>);

          // Return tuple
          return tuple;
        },
        [new Set()] as [Set<FieldPath<T>>],
      )
      .map((set) => [...set]) as [FieldPath<T>[]];
  }

  // Otherwise return every field and field array name
  return [allFieldNames];
}
