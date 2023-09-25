import type { FieldPath, FormStore, ResponseData } from "../types";
export declare function getFilteredNames<S, T, TResponseData extends ResponseData<T>, TOptions extends Record<string, any>>(form: FormStore<S, T, TResponseData>, arg2?: FieldPath<T> | FieldPath<T>[] | TOptions | undefined, shouldValid?: boolean | undefined): [FieldPath<T>[]];
