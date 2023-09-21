import { FieldsStore, FormOptions, ResponseData } from "../types";
export declare function getInitialStores<T, TResponseData extends ResponseData<T>>({ loader, action, }: Pick<FormOptions<T, TResponseData>, "loader" | "action">): [FieldsStore<T>];
