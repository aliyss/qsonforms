/*
MIT License

Copyright (c) 2022 Fabian Hiller

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import type { FieldPath, FieldPathValue, FieldStore } from "../types";
import { isFieldDirty } from "./isFieldDirty";

type InitialFieldState<T, TFieldName extends FieldPath<T>> = {
  value: FieldPathValue<T, TFieldName> | undefined;
  initialValue: FieldPathValue<T, TFieldName> | undefined;
  error: string;
};

export function getInitialFieldStore<T, TFieldName extends FieldPath<T>>(
  name: TFieldName,
  { value, initialValue, error }: InitialFieldState<T, TFieldName> = {
    value: undefined,
    initialValue: undefined,
    error: "",
  },
): FieldStore<T, TFieldName> {
  const dirty = isFieldDirty(
    initialValue as Partial<T>,
    value as Partial<T> | undefined,
  );
  return {
    internal: {
      initialValue,
      startValue: initialValue,
      validate: [],
      transform: [],
      elements: [],
      consumers: [],
    },
    name,
    value,
    error,
    active: false,
    touched: dirty,
    dirty,
  };
}
