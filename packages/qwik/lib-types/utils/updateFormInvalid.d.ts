import type { FormStore, ResponseData } from "../types";
export declare function updateFormInvalid<T, TResponseData extends ResponseData<T>>(form: FormStore<T, TResponseData>, invalid?: boolean | undefined): void;
