import type { FieldPath, FormStore, ResponseData } from "../types";
export declare function focus<T, S, TResponseData extends ResponseData<S>>(form: FormStore<T, S, TResponseData>, name: FieldPath<S>): void;
