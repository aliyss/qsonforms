import type { FieldPath, FieldStore, FormStore, ResponseData } from "../types";
export declare function getFieldStore<T, TResponseData extends ResponseData<T>, TFieldName extends FieldPath<T>>(form: FormStore<T, TResponseData>, name: TFieldName): FieldStore<T, TFieldName> | undefined;
