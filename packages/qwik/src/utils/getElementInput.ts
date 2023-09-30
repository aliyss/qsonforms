/*
MIT License

Copyright (c) 2022 Fabian Hiller

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import { noSerialize } from "@builder.io/qwik";
import type {
  FieldElement,
  FieldPath,
  FieldPathValue,
  FieldStore,
  FieldType,
} from "../types";

/**
 * Returns the current input of the element.
 *
 * @param element The field element.
 * @param field The store of the field.
 * @param type The data type to capture.
 *
 * @returns The element input.
 */
export function getElementInput<T, TFieldName extends FieldPath<T>>(
  element: FieldElement,
  field: FieldStore<T, TFieldName>,
  type: FieldType<any> | undefined,
): FieldPathValue<T, TFieldName> {
  const { checked, files, options, value, valueAsDate, valueAsNumber } =
    element as HTMLInputElement & HTMLSelectElement & HTMLTextAreaElement;
  return (
    !type || type === "string"
      ? value
      : type === "string[]"
      ? options
        ? // @ts-ignore
          [...options]
            .filter((e) => e.selected && !e.disabled)
            .map((e) => e.value)
        : checked
        ? [...((field.value || []) as string[]), value]
        : ((field.value || []) as string[]).filter((v) => v !== value)
      : type === "number"
      ? Number.isNaN(valueAsNumber)
        ? undefined
        : valueAsNumber
      : type === "integer"
      ? valueAsNumber
      : type === "boolean"
      ? checked
      : type === "File" && files
      ? noSerialize(files[0])
      : type === "File[]" && files
      ? // @ts-ignore
        [...files].map((file) => noSerialize(file))
      : type === "Date" && valueAsDate
      ? valueAsDate
      : field.value
  ) as FieldPathValue<T, TFieldName>;
}
