import type { FormOptions, FormStore, FromData, FromDataSchema, ResponseData } from "../types";
/**
 * Creates and returns the store of the form.
 *
 * TODO: Add initialValues option beside loader
 *
 * @param options The form options.
 *
 * @returns The reactive store.
 */
export declare function useQSONFormStore<T extends FromDataSchema, TResponseData extends ResponseData<FromData<T>> = undefined>(schema: T, { validate, validateOn, revalidateOn, hideSubmitButton, ...options }: FormOptions<FromData<T>, TResponseData>): FormStore<FromData<T>, TResponseData>;
