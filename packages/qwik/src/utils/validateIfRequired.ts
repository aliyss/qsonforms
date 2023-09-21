/*
MIT License

Copyright (c) 2022 Fabian Hiller

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import type {
  FieldPath,
  FieldStore,
  FormStore,
  ResponseData,
  ValidationMode,
} from "../types";
import { validate } from "../methods";

/**
 * Value type of the validate otions.
 */
type ValidateOptions = {
  on: Exclude<ValidationMode, "submit">[];
  shouldFocus?: boolean | undefined;
};

/**
 * Validates a field or field array only if required.
 *
 * @param form The form of the field or field array.
 * @param fieldOrFieldArray The store of the field or field array.
 * @param name The name of the field or field array.
 * @param options The validate options.
 */
export function validateIfRequired<
  T,
  TResponseData extends ResponseData<T>,
  TFieldName extends FieldPath<T>,
>(
  form: FormStore<T, TResponseData>,
  fieldOrFieldArray: FieldStore<T, TFieldName>,
  name: TFieldName | T,
  { on: modes, shouldFocus = false }: ValidateOptions,
): void {
  if (
    (modes as string[]).includes(
      (
        form.internal.validateOn === "submit"
          ? form.submitted
          : fieldOrFieldArray.error
      )
        ? form.internal.revalidateOn
        : form.internal.validateOn,
    )
  ) {
    // @ts-ignore
    validate(form, name, { shouldFocus });
  }
}
