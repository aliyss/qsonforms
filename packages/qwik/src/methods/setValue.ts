import type {
  FieldPath,
  FieldPathValue,
  FormStore,
  ResponseData,
} from "../types";
import {
  initializeFieldStore,
  updateFieldDirty,
  validateIfRequired,
} from "../utils";

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
export function setValue<
  T,
  TResponseData extends ResponseData<T>,
  TFieldName extends FieldPath<T>,
>(
  form: FormStore<T, TResponseData>,
  name: TFieldName,
  value: FieldPathValue<T, TFieldName>,
  {
    shouldTouched = true,
    shouldDirty = true,
    shouldValidate = true,
    shouldFocus = true,
  }: SetValueOptions | undefined = {},
): void {
  // Initialize store of specified field
  const field = initializeFieldStore(form, name);

  // Set new value
  field.value = value as any;

  // Update touched if set to "true"
  if (shouldTouched) {
    field.touched = true;
    form.touched = true;
  }

  // Update dirty if set to "true"
  if (shouldDirty) {
    updateFieldDirty(form, field);
  }

  // Validate if set to "true" and necessary
  if (shouldValidate) {
    validateIfRequired(form, field, name, {
      on: ["touched", "input"],
      shouldFocus,
    });
  }
}
