import type { FieldPath, FieldStore, FormStore, ResponseData, ValidationMode } from "../types";
/**
 * Value type of the validate otions.
 */
type ValidateOptions = {
    on: Exclude<ValidationMode, "submit">[];
    shouldFocus?: boolean | undefined;
};
/**
 * Validates a field or field array only if required.
 *
 * @param form The form of the field or field array.
 * @param fieldOrFieldArray The store of the field or field array.
 * @param name The name of the field or field array.
 * @param options The validate options.
 */
export declare function validateIfRequired<T, TResponseData extends ResponseData<T>, TFieldName extends FieldPath<T>>(form: FormStore<T, TResponseData>, fieldOrFieldArray: FieldStore<T, TFieldName>, name: TFieldName | T, { on: modes, shouldFocus }: ValidateOptions): void;
export {};
