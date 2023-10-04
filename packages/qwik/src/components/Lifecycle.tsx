/*
MIT License

Copyright (c) 2022 Fabian Hiller

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import {
  component$,
  Slot,
  useVisibleTask$,
  type PublicProps,
  type JSXNode,
  type QRL,
} from "@builder.io/qwik";
import type { JSX } from "@builder.io/qwik/jsx-runtime";
import { reset } from "../methods";
import type {
  FieldPath,
  FieldPathValue,
  FieldStore,
  FormStore,
  ResponseData,
  TransformField,
  ValidateField,
} from "../types";
import { getUniqueId, updateFormState } from "../utils";

/**
 * Value type of the lifecycle properties.
 */
type LifecycleProps<
  S,
  T,
  TResponseData extends ResponseData<T>,
  TFieldName extends FieldPath<T>,
> = {
  key: string | number;
  of: FormStore<S, T, TResponseData>;
  store: FieldStore<T, TFieldName>;
  validate?: QRL<ValidateField<FieldPathValue<T, TFieldName>>> | undefined;
  transform?: QRL<TransformField<FieldPathValue<T, TFieldName>>> | undefined;
  keepActive?: boolean | undefined;
  keepState?: boolean | undefined;
};

/**
 * Component that handles the lifecycle dependent state of a field or field
 * array.
 */
export const Lifecycle: <
  S,
  T,
  TResponseData extends ResponseData<T>,
  TFieldName extends FieldPath<T>,
>(
  props: PublicProps<LifecycleProps<S, T, TResponseData, TFieldName>>,
  key: string | null,
  flags: number,
) => JSXNode | null = component$(
  <
    S,
    T,
    TResponseData extends ResponseData<T>,
    TFieldName extends FieldPath<T>,
  >({
    of: form,
    store,
    transform,
    keepActive,
    keepState,
  }: LifecycleProps<S, T, TResponseData, TFieldName>): JSX.Element => {
    // TODO: Switch back to `useTask$` once issue #3193 is fixed
    useVisibleTask$(({ cleanup }) => {
      // Add validation functions

      // Add transformation functions
      if ("value" in store) {
        store.internal.transform = transform
          ? Array.isArray(transform)
            ? transform
            : [transform]
          : [];
      }

      // Create unique consumer ID
      const consumer = getUniqueId();

      // Add consumer to field
      store.internal.consumers.push(consumer);

      // Mark field as active and update form state if necessary
      if (!store.active) {
        store.active = true;
        updateFormState(form);
      }

      // On cleanup, remove consumer from field
      cleanup(() =>
        setTimeout(() => {
          if (!store) {
            updateFormState(form);
            return;
          }

          store.internal.consumers.splice(
            store.internal.consumers.indexOf(consumer),
            1,
          );

          // Mark field as inactive if there is no other consumer
          if (!keepActive && !store.internal.consumers.length) {
            store.active = false;

            // Reset state if it is not to be kept
            if (!keepState) {
              reset(form, store.name);

              // Otherwise just update form state
            } else {
              updateFormState(form);
            }
          }

          // Remove unmounted elements
          if ("value" in store) {
            store.internal.elements = store.internal.elements.filter(
              (element: any) => element.isConnected,
            );
          }
        }, 15),
      );
    });

    return <Slot />;
  },
);
