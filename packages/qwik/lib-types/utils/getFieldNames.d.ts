import type { FieldPath, FormStore, ResponseData } from "../types";
export declare function getFieldNames<S, T, TResponseData extends ResponseData<T>>(form: FormStore<S, T, TResponseData>, shouldValid?: boolean | undefined): FieldPath<T>[];
