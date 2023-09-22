import { type SetResponseOptions } from "../methods";
import type { FormErrors, FormStore, ResponseData } from "../types";
/**
 * Value type of the error response options.
 */
type ErrorResponseOptions = SetResponseOptions & Partial<{
    shouldActive: boolean;
}>;
/**
 * Sets an error response if a form error was not set at any field or field
 * array.
 *
 * @param form The form of the errors.
 * @param _formErrors The form errors.
 * @param options The error options.
 */
export declare function setErrorResponse<T, TResponseData extends ResponseData<T>>(form: FormStore<T, TResponseData>, formErrors: FormErrors, { duration }: ErrorResponseOptions): void;
export {};
