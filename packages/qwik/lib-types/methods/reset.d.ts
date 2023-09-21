import type { ResponseData, FormStore, FieldPath, FieldPathValue } from "../types";
/**
 * Value type of the reset options.
 */
export type ResetOptions<T, TFieldName extends FieldPath<T>> = Partial<{
    initialValue: FieldPathValue<T, TFieldName>;
    initialValues: Partial<T>;
    keepResponse: boolean;
    keepSubmitCount: boolean;
    keepSubmitted: boolean;
    keepValues: boolean;
    keepDirtyValues: boolean;
    keepItems: boolean;
    keepDirtyItems: boolean;
    keepErrors: boolean;
    keepTouched: boolean;
    keepDirty: boolean;
}>;
/**
 * Resets the entire form, several fields and field arrays or a singel field or
 * field array.
 *
 * @param form The form to be reset.
 * @param options The reset options.
 */
export declare function reset<T, TResponseData extends ResponseData<T>>(form: FormStore<T, TResponseData>, options?: ResetOptions<T, FieldPath<T>> | undefined): void;
/**
 * Resets the entire form, several fields and field arrays or a singel field or
 * field array.
 *
 * @param form The form to be reset.
 * @param name The field or field array to be reset.
 * @param options The reset options.
 */
export declare function reset<T, TResponseData extends ResponseData<T>, TFieldName extends FieldPath<T>>(form: FormStore<T, TResponseData>, name: TFieldName, options?: ResetOptions<T, TFieldName> | undefined): void;
/**
 * Resets the entire form, several fields and field arrays or a singel field or
 * field array.
 *
 * @param form The form to be reset.
 * @param names The fields and field arrays to be reset.
 * @param options The reset options.
 */
export declare function reset<T, TResponseData extends ResponseData<T>>(form: FormStore<T, TResponseData>, names: FieldPath<T>[], options?: ResetOptions<T, FieldPath<T>> | undefined): void;
