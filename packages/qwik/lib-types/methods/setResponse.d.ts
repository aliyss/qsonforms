import type { FormResponse, FormStore, ResponseData } from "../types";
/**
 * Value type of the set response options.
 */
export type SetResponseOptions = Partial<{
    duration: number;
}>;
/**
 * Sets the response of the form.
 *
 * @param form The form of the response.
 * @param response The response object.
 * @param options The response options.
 */
export declare function setResponse<T, TResponseData extends ResponseData<T>>(form: FormStore<T, TResponseData>, response: FormResponse<TResponseData>, { duration }?: SetResponseOptions | undefined): void;
