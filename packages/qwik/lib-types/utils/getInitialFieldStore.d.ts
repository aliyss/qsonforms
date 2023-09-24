import type { ErrorObject } from "ajv";
import type { FieldPath, FieldPathValue, FieldStore } from "../types";
type InitialFieldState<T, TFieldName extends FieldPath<T>> = {
    value: FieldPathValue<T, TFieldName> | undefined;
    initialValue: FieldPathValue<T, TFieldName> | undefined;
    error: ErrorObject[];
};
export declare function getInitialFieldStore<T, TFieldName extends FieldPath<T>>(name: TFieldName, { value, initialValue, error }?: InitialFieldState<T, TFieldName>): FieldStore<T, TFieldName>;
export {};
