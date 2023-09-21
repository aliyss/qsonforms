import type { FormStore, ResponseData } from "../types";
/**
 * Updates the touched, dirty and invalid state of the form.
 *
 * @param form The store of the form.
 */
export declare function updateFormState<T, TResponseData extends ResponseData<T>>(form: FormStore<T, TResponseData>): void;
