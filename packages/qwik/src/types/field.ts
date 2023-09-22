/*
MIT License

Copyright (c) 2022 Fabian Hiller

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import {
  NoSerialize,
  QRL,
  QwikChangeEvent,
  QwikFocusEvent,
} from "@builder.io/qwik";
import { FieldPath, FieldPathValue } from "./path";
import { ErrorObject } from "ajv";

export type FieldElement =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement;

export type FieldEvent =
  | Event
  | QwikChangeEvent<FieldElement>
  | QwikFocusEvent<FieldElement>;

export type PartialKey<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
export type ValidateField<T> = (value: T) => Promise<string> | undefined;

export type FieldType<T> = T extends string | null | undefined
  ? "string"
  : T extends string[] | null | undefined
  ? "string[]"
  : T extends number | null | undefined
  ? "number"
  : T extends boolean | null | undefined
  ? "boolean"
  : T extends NoSerialize<Blob> | NoSerialize<File> | null | undefined
  ? "File"
  : T extends NoSerialize<Blob>[] | NoSerialize<File>[] | null | undefined
  ? "File[]"
  : T extends Date | null | undefined
  ? "Date"
  : never;

/**
 * Function type to transform a field.
 */
export type TransformField<T> = (
  value: T | undefined,
  event: FieldEvent,
  element: FieldElement,
) => Promise<T | undefined> | undefined;

export type InternalFieldStore<T, TFieldName extends FieldPath<T>> = {
  initialValue: FieldPathValue<T, TFieldName> | undefined;
  startValue: FieldPathValue<T, TFieldName> | undefined;
  validate: QRL<ValidateField<FieldPathValue<T, TFieldName> | undefined>>[];
  transform: QRL<TransformField<FieldPathValue<T, TFieldName>>>[];
  elements: FieldElement[];
  consumers: number[];
};

export type FieldStore<T, TFieldName extends FieldPath<T>> = {
  internal: InternalFieldStore<T, TFieldName>;
  name: TFieldName;
  value: FieldPathValue<T, TFieldName> | undefined;
  error: ErrorObject[];
  active: boolean;
  touched: boolean;
  dirty: boolean;
};
