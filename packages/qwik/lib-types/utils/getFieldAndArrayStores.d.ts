import type { FieldPath, FieldStore, FormStore, ResponseData } from "../types";
export declare function getFieldAndArrayStores<S, T, TResponseData extends ResponseData<T>>(form: FormStore<S, T, TResponseData>): FieldStore<T, FieldPath<T>>[];
