import type { FieldPath, FieldStore, FormStore, ResponseData } from "../types";
export declare function getFieldStore<T, S, TResponseData extends ResponseData<S>, TFieldName extends FieldPath<S>>(form: FormStore<T, S, TResponseData>, name: TFieldName): FieldStore<S, TFieldName> | undefined;
