import type { FormStore, ResponseData, FieldPath } from "../types";
export type GetValuesOptions = Partial<{
    shouldActive: boolean;
    shouldTouched: boolean;
    shouldDirty: boolean;
    shouldValid: boolean;
}>;
export declare function getValues<S, T, TResponseData extends ResponseData<T>>(form: FormStore<S, T, TResponseData>, options?: GetValuesOptions | undefined): Partial<T>;
export declare function getValues<S, T, TResponseData extends ResponseData<T>>(form: FormStore<S, T, TResponseData>, names: FieldPath<T>[], options?: GetValuesOptions | undefined): Partial<T>;
