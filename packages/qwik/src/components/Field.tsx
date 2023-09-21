/*
MIT License

Copyright (c) 2022 Fabian Hiller

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import type { QwikChangeEvent, QwikFocusEvent, QRL } from "@builder.io/qwik";
import { $ } from "@builder.io/qwik";
import { isServer } from "@builder.io/qwik/build";
import type { JSX } from "@builder.io/qwik/jsx-runtime";
import { getElementInput, getFieldStore, handleFieldEvent } from "../utils";

import type {
  FieldElement,
  FieldPath,
  FieldPathValue,
  FieldStore,
  FieldType,
  PartialKey,
  FormStore,
  ResponseData,
  TransformField,
  ValidateField,
} from "../types";
import { Lifecycle } from "./Lifecycle";

/**
 * Value type of the field element props.
 */
export type FieldElementProps<T, TFieldName extends FieldPath<T>> = {
  name: TFieldName;
  autoFocus: boolean;
  ref: (element: Element) => void;
  onInput$: (event: Event, element: FieldElement) => void;
  onChange$: (
    event: QwikChangeEvent<FieldElement>,
    element: FieldElement,
  ) => void;
  onBlur$: (event: QwikFocusEvent<FieldElement>, element: FieldElement) => void;
};

/**
 * Value type of the field props.
 */
export type FieldProps<
  T,
  TResponseData extends ResponseData<T>,
  TFieldName extends FieldPath<T>,
> = {
  of: FormStore<T, TResponseData>;
  name: TFieldName;
  type: FieldType<FieldPathValue<T, TFieldName>>;
  children: (
    store: FieldStore<T, TFieldName>,
    props: FieldElementProps<T, TFieldName>,
  ) => JSX.Element;
  validate?: QRL<ValidateField<FieldPathValue<T, TFieldName>>> | undefined;
  transform?: QRL<TransformField<FieldPathValue<T, TFieldName>>> | undefined;
  keepActive?: boolean | undefined;
  keepState?: boolean | undefined;
  key?: string | number | undefined;
};

/**
 * Headless form field that provides reactive properties and state.
 */
export function Field<
  T,
  TResponseData extends ResponseData<T>,
  TFieldName extends FieldPath<T>,
>({
  children,
  name,
  type,
  ...props
}: FieldPathValue<T, TFieldName> extends string | null | undefined
  ? PartialKey<FieldProps<T, TResponseData, TFieldName>, "type">
  : FieldProps<T, TResponseData, TFieldName>): JSX.Element {
  // Destructure props
  const { of: form } = props;

  // Get store of specified field
  const field = getFieldStore(form, name)!;

  return (
    <Lifecycle key={name} store={field} {...props}>
      {children(field, {
        name,
        autoFocus: isServer && !!field.error,
        ref: $((element: Element) => {
          field.internal.elements.push(element as FieldElement);
        }),
        onInput$: $((event: Event, element: FieldElement) => {
          handleFieldEvent(
            form,
            field,
            name,
            event,
            element,
            ["touched", "input"],
            getElementInput(element, field, type),
          );
        }),
        onChange$: $(
          (event: QwikChangeEvent<FieldElement>, element: FieldElement) => {
            handleFieldEvent(form, field, name, event, element, ["change"]);
          },
        ),
        onBlur$: $(
          (event: QwikFocusEvent<FieldElement>, element: FieldElement) => {
            handleFieldEvent(form, field, name, event, element, [
              "touched",
              "blur",
            ]);
          },
        ),
      })}
    </Lifecycle>
  );
}
