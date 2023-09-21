import type { FieldElement, FieldEvent, FieldPath, FieldPathValue, FieldStore, FormStore, ResponseData, ValidationMode } from "../types";
/**
 * Handles the input, change and blur event of a field.
 *
 * @param form The form of the field.
 * @param field The store of the field.
 * @param name The name of the field.
 * @param event The event of the field.
 * @param element The element of the field.
 * @param validationModes The modes of the validation.
 * @param inputValue The value of the input.
 */
export declare function handleFieldEvent<T, TResponseData extends ResponseData<T>, TFieldName extends FieldPath<T>>(form: FormStore<T, TResponseData>, field: FieldStore<T, TFieldName>, name: TFieldName, event: FieldEvent, element: FieldElement, validationModes: Exclude<ValidationMode, "submit">[], inputValue?: FieldPathValue<T, TFieldName>): Promise<void>;
