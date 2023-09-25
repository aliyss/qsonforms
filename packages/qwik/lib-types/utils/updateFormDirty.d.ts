import type { FormStore, ResponseData } from "../types";
/**
 * Updates the dirty state of the form.
 *
 * @param form The store of the form.
 * @param dirty Whether dirty state is true.
 */
export declare function updateFormDirty<S, T, TResponseData extends ResponseData<T>>(form: FormStore<S, T, TResponseData>, dirty?: boolean | undefined): void;
