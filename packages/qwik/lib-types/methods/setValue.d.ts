import type { FieldPath, FieldPathValue, FormStore, ResponseData } from "../types";
/**
 * Value type of the set value options.
 */
export type SetValueOptions = Partial<{
    shouldTouched: boolean;
    shouldDirty: boolean;
    shouldValidate: boolean;
    shouldFocus: boolean;
}>;
/**
 * Sets the value of the specified field.
 *
 * @param form The form of the field.
 * @param name The name of the field.
 * @param value The value to bet set.
 * @param options The value options.
 */
export declare function setValue<S, T, TResponseData extends ResponseData<T>, TFieldName extends FieldPath<T>>(form: FormStore<S, T, TResponseData>, name: TFieldName, value: FieldPathValue<T, TFieldName>, { shouldTouched, shouldDirty, shouldValidate, shouldFocus, }?: SetValueOptions | undefined): void;
