import type { FieldPath, FieldPathValue, FormStore, ResponseData } from "../types";
/**
 * Value type of the get value options.
 */
export type GetValueOptions = Partial<{
    shouldActive: boolean;
    shouldTouched: boolean;
    shouldDirty: boolean;
    shouldValid: boolean;
}>;
/**
 * Returns the value of the specified field.
 *
 * @param form The form of the field.
 * @param name The name of the field.
 * @param options The value options.
 *
 * @returns The value of the field.
 */
export declare function getValue<T, TResponseData extends ResponseData<T>, TFieldName extends FieldPath<T>>(form: FormStore<T, TResponseData>, name: TFieldName, { shouldActive, shouldTouched, shouldDirty, shouldValid, }?: GetValueOptions | undefined): FieldPathValue<T, TFieldName> | undefined;
