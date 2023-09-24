import type { FieldPath, FormStore, ResponseData } from "../types";
export declare function getFieldNames<T, TResponseData extends ResponseData<T>>(form: FormStore<T, TResponseData>, shouldValid?: boolean | undefined): FieldPath<T>[];
