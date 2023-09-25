/*
MIT License

Copyright (c) 2022 Fabian Hiller

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import type {
  FieldElement,
  FieldEvent,
  FieldPath,
  FieldPathValue,
  FieldStore,
  FormStore,
  ResponseData,
  ValidationMode,
} from "../types";
import { updateFieldDirty } from "./updateFieldDirty";
import { validateIfRequired } from "./validateIfRequired";

/**
 * Handles the input, change and blur event of a field.
 *
 * @param form The form of the field.
 * @param field The store of the field.
 * @param name The name of the field.
 * @param event The event of the field.
 * @param element The element of the field.
 * @param validationModes The modes of the validation.
 * @param inputValue The value of the input.
 */
export async function handleFieldEvent<
  S,
  T,
  TResponseData extends ResponseData<T>,
  TFieldName extends FieldPath<T>,
>(
  form: FormStore<S, T, TResponseData>,
  field: FieldStore<T, TFieldName>,
  name: TFieldName,
  event: FieldEvent,
  element: FieldElement,
  validationModes: Exclude<ValidationMode, "submit">[],
  inputValue?: FieldPathValue<T, TFieldName>,
) {
  // Update value state
  if (inputValue !== undefined && inputValue !== null) {
    // @ts-ignore
    field.value = inputValue;
  }

  // Transform value state
  for (const transformation of field.internal.transform) {
    field.value = await transformation(field.value, event, element);
  }

  // Update touched state
  field.touched = true;
  form.touched = true;

  // Update dirty state
  updateFieldDirty(form, field);

  // Validate value if required
  validateIfRequired(form, field, name, { on: validationModes });
}
