import type { FieldElement, FieldPath, FieldPathValue, FieldStore, FieldType } from "../types";
/**
 * Returns the current input of the element.
 *
 * @param element The field element.
 * @param field The store of the field.
 * @param type The data type to capture.
 *
 * @returns The element input.
 */
export declare function getElementInput<T, TFieldName extends FieldPath<T>>(element: FieldElement, field: FieldStore<T, TFieldName>, type: FieldType<any> | undefined): FieldPathValue<T, TFieldName>;
