import type { FormOptions, FormStore, FromData, ResponseData } from "../types";
import { JSONSchema7 } from "json-schema";
/**
 * Creates and returns the store of the form.
 *
 * TODO: Add initialValues option beside loader
 *
 * @param options The form options.
 *
 * @returns The reactive store.
 */
export declare function useQJSONFormStore<T extends JSONSchema7, TResponseData extends ResponseData<FromData<T>> = undefined>(schema: T, { validate, validateOn, revalidateOn, ...options }: FormOptions<FromData<T>, TResponseData>): FormStore<FromData<T>, TResponseData>;
