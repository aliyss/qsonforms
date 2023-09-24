import type { FieldPath, FieldPathValue } from "../types";
export declare function getPathValue<T, TFieldName extends FieldPath<T>>(path: TFieldName, object: Partial<T>): FieldPathValue<T, TFieldName> | undefined;
