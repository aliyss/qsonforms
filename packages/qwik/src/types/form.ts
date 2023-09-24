/*
MIT License

Copyright (c) 2022 Fabian Hiller

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import type { QRL, Signal } from "@builder.io/qwik";
import type { UiSchema } from "../models/uiSchema/build";
import type { ErrorObject, Schema as ValidationSchema } from "ajv";
import type { ActionStore } from "@builder.io/qwik-city";
import type { FieldPath } from "./path";
import type { FieldStore } from "./field";

export type FromDataSchema = ValidationSchema;

// eslint-disable-next-line
export type FromData<_ extends FromDataSchema> =
  | Record<string, any>
  | string
  | undefined;

export type ValidationMode =
  | "touched"
  | "input"
  | "change"
  | "blur"
  | "submit"
  | "none";

export type ResponseStatus = "info" | "error" | "success";

export type ResponseData<T> = T | undefined;

export type FormError = ErrorObject<string, Record<string, any>, any>[] | any;

export type FormErrors = FormError | null | any | undefined;

export type ValidateForm<T> = (values: Partial<T>) => FormErrors;

export type FormActionStore<T, TResponseData extends ResponseData<T>> = {
  values: Partial<T>;
  errors: FormErrors;
  response: FormResponse<TResponseData>;
};

export type FormOptions<T, TResponseData extends ResponseData<T>> = {
  loader: Readonly<Signal<Partial<T>>>;
  uiSchema: UiSchema;
  action?:
    | ActionStore<FormActionStore<T, TResponseData>, Partial<T>, true>
    | undefined;
  validate?: QRL<ValidateForm<T>> | undefined;
  validateOn?: ValidationMode | undefined;
  revalidateOn?: ValidationMode | undefined;
  hideSubmitButton?: boolean | undefined;
};

export type FormResponse<TResponseData> = Partial<{
  status: ResponseStatus;
  message: FormErrors;
  data: TResponseData;
}>;

export type FieldsStore<T> = {
  [Name in FieldPath<T>]?: FieldStore<T, Name>;
};

export type InternalFormStore<T> = {
  fields: FieldsStore<T>;
  validate: QRL<ValidateForm<T>> | undefined;
  validators: number[];
  validateOn: ValidationMode;
  hideSubmitButton: boolean | undefined;
  revalidateOn: ValidationMode;
};

export type FormStore<T, TResponseData extends ResponseData<T>> = {
  internal: InternalFormStore<T>;

  schema: FromDataSchema;
  uiSchema: UiSchema;
  element: HTMLFormElement | undefined;
  submitCount: number;
  submitting: boolean;
  submitted: boolean;
  validating: boolean;
  touched: boolean;
  dirty: boolean;
  invalid: boolean;
  response: FormResponse<TResponseData>;
};
