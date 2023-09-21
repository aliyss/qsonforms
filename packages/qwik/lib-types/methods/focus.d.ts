import { FieldPath, FormStore, ResponseData } from "../types";
export declare function focus<T, TResponseData extends ResponseData<T>>(form: FormStore<T, TResponseData>, name: FieldPath<T>): void;
