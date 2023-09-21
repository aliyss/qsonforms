/*
MIT License

Copyright (c) 2022 Fabian Hiller

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import type { JSX } from "@builder.io/qwik/jsx-runtime";
import type { FormProps } from "../components";
import { QJSONForm } from "../components";
import type { FormOptions, FormStore, FromData, ResponseData } from "../types";
import { JSONSchema7 } from "json-schema";
import { useQJSONFormStore } from "./useQJSONFormStore";

/**
 * Creates and returns the store of the form as well as a linked Form, Field
 * and FieldArray component.
 *
 * @param options The form options.
 *
 * @returns The store and linked components.
 */
export function useQJSONForm<
  T extends JSONSchema7 = JSONSchema7,
  TResponseData extends ResponseData<FromData<T>> = undefined,
>(
  schema: T,
  options: FormOptions<FromData<T>, TResponseData>,
): [
  FormStore<FromData<T>, TResponseData>,
  {
    QJSONForm: (
      props: Omit<FormProps<FromData<T>, TResponseData>, "of" | "action">,
    ) => JSX.Element;
  },
] {
  // Use form store
  const form = useQJSONFormStore<T, TResponseData>(schema, options);

  // Return form store and linked components
  return [
    form,
    {
      QJSONForm: (
        props: Omit<FormProps<FromData<T>, TResponseData>, "of" | "action">,
      ) => QJSONForm({ of: form, action: options.action, ...props }),
    },
  ];
}
