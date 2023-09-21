import type { FormStore, ResponseData } from "../types";
/**
 * Updates the dirty state of the form.
 *
 * @param form The store of the form.
 * @param dirty Whether dirty state is true.
 */
export declare function updateFormDirty<T, TResponseData extends ResponseData<T>>(form: FormStore<T, TResponseData>, dirty?: boolean | undefined): void;
