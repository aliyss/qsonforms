import type {
  FieldPath,
  FieldPathValue,
  FormStore,
  ResponseData,
} from "../types";
import { getFieldStore } from "../utils";

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
export function getValue<
  T,
  TResponseData extends ResponseData<T>,
  TFieldName extends FieldPath<T>,
>(
  form: FormStore<T, TResponseData>,
  name: TFieldName,
  {
    shouldActive = true,
    shouldTouched = false,
    shouldDirty = false,
    shouldValid = false,
  }: GetValueOptions | undefined = {},
): FieldPathValue<T, TFieldName> | undefined {
  // Get store of specified field
  const field = getFieldStore(form, name);

  // Continue if field corresponds to filter options
  if (
    field &&
    (!shouldActive || field.active) &&
    (!shouldTouched || field.touched) &&
    (!shouldDirty || field.dirty) &&
    (!shouldValid || !field.error)
  ) {
    // Return value of field
    return field.value as any;
  }

  // Otherwise return undefined
  return undefined;
}
