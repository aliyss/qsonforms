import type { FormOptions, FormStore, FromData, ResponseData } from "../types";
/**
 * Creates and returns the store of the form.
 *
 * TODO: Add initialValues option beside loader
 *
 * @param options The form options.
 *
 * @returns The reactive store.
 */
export declare function useQSONFormStore<T, S, TResponseData extends ResponseData<FromData<S>> = undefined>(schema: T, { validate, validateOn, revalidateOn, hideSubmitButton, ...options }: FormOptions<FromData<S>, TResponseData>): FormStore<T, FromData<S>, TResponseData>;
