import type { ResponseData, FormStore, FieldPath } from "../types";
/**
 * Value type of the validate options.
 */
export type ValidateOptions = Partial<{
    shouldActive: boolean;
    shouldFocus: boolean;
}>;
/**
 * Validates the entire form.
 *
 * @param form The form to be validated.
 * @param options The validation options.
 *
 * @returns Whether the fields are valid.
 */
export declare function validate<S, T, TResponseData extends ResponseData<T>>(form: FormStore<S, T, TResponseData>, options?: ValidateOptions | undefined): Promise<boolean>;
/**
 * Validates a single field or field array.
 *
 * @param form The form to be validated.
 * @param name The field or field array to be validated.
 * @param options The validation options.
 *
 * @returns Whether the fields are valid.
 */
export declare function validate<S, T, TResponseData extends ResponseData<T>>(form: FormStore<S, T, TResponseData>, name: FieldPath<T>, options?: ValidateOptions | undefined): Promise<boolean>;
/**
 * Validates several fields and field arrays.
 *
 * @param form The form to be validated.
 * @param names The fields and field arrays to be validated.
 * @param options The validation options.
 *
 * @returns Whether the fields are valid.
 */
export declare function validate<S, T, TResponseData extends ResponseData<T>>(form: FormStore<S, T, TResponseData>, names: FieldPath<T>[], options?: ValidateOptions | undefined): Promise<boolean>;
