/*
MIT License

Copyright (c) 2022 Fabian Hiller

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import { $, implicit$FirstArg, type QRL } from "@builder.io/qwik";
import type { FieldElement, FieldEvent, TransformField } from "../types";

/**
 * Value type of the transform mode.
 */
export type TransformMode = "input" | "change" | "blur";

/**
 * Value type of the transform options.
 */
export type TransformOptions = {
  on: TransformMode;
};

/**
 * See {@link toCustom$}
 */
export function toCustomQrl<T>(
  action: QRL<TransformField<T>>,
  { on: mode }: TransformOptions,
): QRL<TransformField<T>> {
  return $((value: T | undefined, event: FieldEvent, element: FieldElement) => {
    return event.type === mode ? action(value, event, element) : value;
  });
}

/**
 * Creates a custom transformation functions.
 *
 * @param action The transform action.
 * @param options The transform options.
 *
 * @returns A transformation functions.
 */
export const toCustom$ = implicit$FirstArg(toCustomQrl);
