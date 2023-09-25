import type { FieldPath, FieldStore, FormStore, ResponseData } from "../types";
/**
 * Updates the dirty state of a field.
 *
 * @param form The form of the field.
 * @param field The store of the field.
 */
export declare function updateFieldDirty<S, T, TResponseData extends ResponseData<T>, TFielName extends FieldPath<T>>(form: FormStore<S, T, TResponseData>, field: FieldStore<T, TFielName>): void;
