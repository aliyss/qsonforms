/*
MIT License

Copyright (c) 2022 Fabian Hiller

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import type { FieldPath, FieldStore, FormStore, ResponseData } from "../types";
import { isFieldDirty } from "./isFieldDirty";
import { updateFormDirty } from "./updateFormDirty";

/**
 * Updates the dirty state of a field.
 *
 * @param form The form of the field.
 * @param field The store of the field.
 */
export function updateFieldDirty<
  T,
  TResponseData extends ResponseData<T>,
  TFielName extends FieldPath<T>,
>(form: FormStore<T, TResponseData>, field: FieldStore<T, TFielName>): void {
  // Check if field is dirty
  const dirty = isFieldDirty(
    // Actually Key of
    field.internal.startValue as T | undefined,
    field.value as T,
  );

  // Update dirty state of field if necessary
  if (dirty !== field.dirty) {
    field.dirty = dirty;

    // Update dirty state of form
    updateFormDirty(form, dirty);
  }
}
