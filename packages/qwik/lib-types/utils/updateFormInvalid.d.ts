import type { FormStore, ResponseData } from "../types";
export declare function updateFormInvalid<S, T, TResponseData extends ResponseData<T>>(form: FormStore<S, T, TResponseData>, invalid?: boolean | undefined): void;
