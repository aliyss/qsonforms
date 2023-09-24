import type { FieldPath, FieldStore, FormStore, ResponseData } from "../types";
/**
 * Initializes and returns the store of a field.
 *
 * @param form The form of the field.
 * @param name The name of the field.
 * @param initialState The initial state.
 *
 * @returns The reactive store.
 */
export declare function initializeFieldStore<T, TResponseData extends ResponseData<T>, TFieldName extends FieldPath<T>>(form: FormStore<T, TResponseData>, name: TFieldName): FieldStore<T, TFieldName>;
