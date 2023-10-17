import type { QRL, Signal } from "@builder.io/qwik";
import type { UiSchema } from "../models/uiSchema/build";
import type { ErrorObject, Schema as ValidationSchema } from "ajv";
import type { ActionStore } from "@builder.io/qwik-city";
import type { FieldPath } from "./path";
import type { FieldStore } from "./field";
export type FromDataSchema = ValidationSchema;
export type FromData<T> = T;
export type ValidationMode = "touched" | "input" | "change" | "blur" | "submit" | "none";
export type ResponseStatus = "info" | "error" | "success";
export type ResponseData<T> = T | undefined;
export type FormError = ErrorObject<string, Record<string, any>, any>[] | any;
export type FormErrors = FormError | null | any | undefined;
export type ValidateForm<T> = (values: Partial<T>) => FormErrors;
export type FormActionStore<T, TResponseData extends ResponseData<T>> = {
    values: Partial<T>;
    errors: FormErrors;
    response: FormResponse<TResponseData>;
};
export type FormOptions<T, TResponseData extends ResponseData<T>> = {
    loader: Readonly<Signal<Partial<T>>>;
    uiSchema: UiSchema;
    action?: ActionStore<FormActionStore<T, TResponseData>, Partial<T>, true> | undefined;
    emptyIsUndefined?: boolean | undefined;
    validate?: QRL<ValidateForm<T>> | undefined;
    validateOn?: ValidationMode | undefined;
    revalidateOn?: ValidationMode | undefined;
    hideSubmitButton?: boolean | undefined;
};
export type FormResponse<TResponseData> = Partial<{
    status: ResponseStatus;
    message: FormErrors;
    data: TResponseData;
}>;
export type FieldsStore<T> = {
    [Name in FieldPath<T>]?: FieldStore<T, Name>;
};
export type InternalFormStore<T> = {
    fields: FieldsStore<T>;
    validate: QRL<ValidateForm<T>> | undefined;
    validators: number[];
    validateOn: ValidationMode;
    hideSubmitButton: boolean | undefined;
    revalidateOn: ValidationMode;
};
export type FormStore<T, S, TResponseData extends ResponseData<S>> = {
    internal: InternalFormStore<S>;
    schema: T;
    disabled?: boolean | undefined;
    emptyIsUndefined?: boolean | undefined;
    uiSchema: UiSchema;
    element: HTMLFormElement | undefined;
    submitCount: number;
    submitting: boolean;
    submitted: boolean;
    validating: boolean;
    touched: boolean;
    dirty: boolean;
    invalid: boolean;
    response: FormResponse<TResponseData>;
};
