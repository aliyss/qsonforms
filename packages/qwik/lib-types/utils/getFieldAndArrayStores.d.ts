import type { FieldPath, FieldStore, FormStore, ResponseData } from "../types";
export declare function getFieldAndArrayStores<T, TResponseData extends ResponseData<T>>(form: FormStore<T, TResponseData>): FieldStore<T, FieldPath<T>>[];
