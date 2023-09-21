/*
MIT License

Copyright (c) 2022 Fabian Hiller

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import {
  FieldPath,
  FieldPathValue,
  FieldsStore,
  FormOptions,
  ResponseData,
} from "../types";
import { getPathValue } from "./getPathValue";
import { getInitialFieldStore } from "./getInitialFieldStore";

export function getInitialStores<T, TResponseData extends ResponseData<T>>({
  loader,
  action,
}: Pick<FormOptions<T, TResponseData>, "loader" | "action">): [FieldsStore<T>] {
  // Create function to get value of field or field array
  function getActionValue<TFieldName extends FieldPath<T>>(
    name: TFieldName,
  ): FieldPathValue<T, TFieldName> | undefined;
  function getActionValue(name: any): any {
    // @ts-ignore
    return action?.value?.values && getPathValue(name, action.value.values);
  }

  // Create function to generate array items
  // const generateItems = () => getUniqueId();

  // Create function to get error of field
  // const getActionError = <TFieldName extends FieldPath<FromData<T>>>(
  //   name: TFieldName,
  // ): string => action?.value?.errors[name] || "";

  // Create recursive function to create initial stores
  const createInitialStores = (
    stores: [FieldsStore<T>],
    data: object,
    prevPath?: string | undefined,
  ) =>
    Object.entries(data).reduce((stores, [path, value]) => {
      // Create new compound path
      const compoundPath = prevPath ? `${prevPath}.${path}` : path;

      // If it is a field array, set initial store

      // Otherwise, if it is a field, set initial store
      if (
        !value ||
        typeof value !== "object" ||
        Array.isArray(value) ||
        value instanceof Date
      ) {
        // @ts-ignore
        stores[0][compoundPath as FieldPath<T>] = getInitialFieldStore(
          compoundPath as FieldPath<T>,
          // @ts-ignore
          {
            initialValue: value,
            value: getActionValue(compoundPath as FieldPath<T>) ?? value,
            // error: getActionError(compoundPath as FieldPath<FromData<T>>),
          },
        );
      }

      // If it is an object or array, add nested stores
      if (value && typeof value === "object") {
        createInitialStores(stores, value, compoundPath);
      }

      // Return modified stores
      return stores;
    }, stores);

  // Create and return initial stores
  return createInitialStores([{}], loader.value) as [FieldsStore<T>];
}
