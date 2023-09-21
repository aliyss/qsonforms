import { type PublicProps, type JSXNode, type QRL } from "@builder.io/qwik";
import type { FieldPath, FieldPathValue, FieldStore, FormStore, ResponseData, TransformField, ValidateField } from "../types";
/**
 * Value type of the lifecycle properties.
 */
type LifecycleProps<T, TResponseData extends ResponseData<T>, TFieldName extends FieldPath<T>> = {
    key: string | number;
    of: FormStore<T, TResponseData>;
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
export declare const Lifecycle: <T, TResponseData extends ResponseData<T>, TFieldName extends FieldPath<T>>(props: PublicProps<LifecycleProps<T, TResponseData, TFieldName>>, key: string | null, flags: number) => JSXNode | null;
export {};
