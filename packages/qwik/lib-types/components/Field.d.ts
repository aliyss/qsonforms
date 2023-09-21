import type { QwikChangeEvent, QwikFocusEvent, QRL } from "@builder.io/qwik";
import type { JSX } from "@builder.io/qwik/jsx-runtime";
import type { FieldElement, FieldPath, FieldPathValue, FieldStore, FieldType, PartialKey, FormStore, ResponseData, TransformField, ValidateField } from "../types";
/**
 * Value type of the field element props.
 */
export type FieldElementProps<T, TFieldName extends FieldPath<T>> = {
    name: TFieldName;
    autoFocus: boolean;
    ref: (element: Element) => void;
    onInput$: (event: Event, element: FieldElement) => void;
    onChange$: (event: QwikChangeEvent<FieldElement>, element: FieldElement) => void;
    onBlur$: (event: QwikFocusEvent<FieldElement>, element: FieldElement) => void;
};
/**
 * Value type of the field props.
 */
export type FieldProps<T, TResponseData extends ResponseData<T>, TFieldName extends FieldPath<T>> = {
    of: FormStore<T, TResponseData>;
    name: TFieldName;
    type: FieldType<FieldPathValue<T, TFieldName>>;
    children: (store: FieldStore<T, TFieldName>, props: FieldElementProps<T, TFieldName>) => JSX.Element;
    validate?: QRL<ValidateField<FieldPathValue<T, TFieldName>>> | undefined;
    transform?: QRL<TransformField<FieldPathValue<T, TFieldName>>> | undefined;
    keepActive?: boolean | undefined;
    keepState?: boolean | undefined;
    key?: string | number | undefined;
};
/**
 * Headless form field that provides reactive properties and state.
 */
export declare function Field<T, TResponseData extends ResponseData<T>, TFieldName extends FieldPath<T>>({ children, name, type, ...props }: FieldPathValue<T, TFieldName> extends string | null | undefined ? PartialKey<FieldProps<T, TResponseData, TFieldName>, "type"> : FieldProps<T, TResponseData, TFieldName>): JSX.Element;
