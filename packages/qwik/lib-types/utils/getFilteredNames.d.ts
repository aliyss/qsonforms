import type { FieldPath, FormStore, ResponseData } from "../types";
export declare function getFilteredNames<T, TResponseData extends ResponseData<T>, TOptions extends Record<string, any>>(form: FormStore<T, TResponseData>, arg2?: FieldPath<T> | FieldPath<T>[] | TOptions | undefined, shouldValid?: boolean | undefined): [FieldPath<T>[]];
