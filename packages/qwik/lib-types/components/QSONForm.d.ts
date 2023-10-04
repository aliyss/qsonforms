import { type QwikSubmitEvent } from "@builder.io/qwik";
import type { ActionStore } from "@builder.io/qwik-city";
import type { JSX } from "@builder.io/qwik/jsx-runtime";
import { type FormActionStore, type FormStore, type FromData, type ResponseData } from "../types";
/**
 * Function type to handle the submission of the form.
 */
export type SubmitHandler<T> = (values: T, event: QwikSubmitEvent<HTMLFormElement>) => Promise<any> | undefined;
/**
 * Value type of the form properties.
 */
export type FormProps<S, T, TResponseData extends ResponseData<T>> = {
    of: FormStore<S, T, TResponseData>;
    action?: ActionStore<FormActionStore<T, TResponseData>, Partial<T>, true> | undefined;
    onSubmit$?: SubmitHandler<T> | undefined;
    responseDuration?: number | undefined;
    keepResponse?: boolean | undefined;
    shouldActive?: boolean | undefined;
    shouldTouched?: boolean | undefined;
    shouldDirty?: boolean | undefined;
    shouldFocus?: boolean | undefined;
    reloadDocument?: boolean | undefined;
    id?: string | undefined;
    class?: string | undefined;
    autoComplete?: "on" | "off" | undefined;
    encType?: "application/x-www-form-urlencoded" | "multipart/form-data" | undefined;
    name?: string | undefined;
    children?: JSX.Element;
};
/**
 * Form element that takes care of validation and simplifies submission.
 */
export declare function QSONForm<S, T, TResponseData extends ResponseData<FromData<T>>>({ of: form, action, onSubmit$, responseDuration: duration, keepResponse, shouldActive, shouldTouched, shouldDirty, shouldFocus, children, reloadDocument, ...formProps }: FormProps<S, FromData<T>, TResponseData>): JSX.Element;
