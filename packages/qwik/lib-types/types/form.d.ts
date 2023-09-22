import { QRL, Signal } from "@builder.io/qwik";
import { UiSchema } from "../models/uiSchema/build";
import { JSONSchema7 as JSONSchemaDirect } from "json-schema";
import { ErrorObject } from "ajv";
import { ActionStore } from "@builder.io/qwik-city";
import { FieldPath } from "./path";
import { FieldStore } from "./field";
type JSONSchema7 = JSONSchemaDirect;
export type FromData<_ extends JSONSchema7> = Record<string, unknown> | string | undefined;
export type ValidationMode = "touched" | "input" | "change" | "blur" | "submit" | "none";
export type ResponseStatus = "info" | "error" | "success";
export type ResponseData<T> = T | undefined;
export type FormErrors = ErrorObject[] | null | undefined;
export type ValidateForm<T> = (values: Partial<T>) => ErrorObject<string, Record<string, any>, unknown>[] | null | undefined;
export type FormActionStore<T, TResponseData extends ResponseData<T>> = {
    values: Partial<T>;
    errors: FormErrors;
    response: FormResponse<TResponseData>;
};
export type FormOptions<T, TResponseData extends ResponseData<T>> = {
    loader: Readonly<Signal<Partial<T>>>;
    uiSchema: UiSchema;
    action?: ActionStore<FormActionStore<T, TResponseData>, Partial<T>, true> | undefined;
    validate?: QRL<ValidateForm<T>> | undefined;
    validateOn?: ValidationMode | undefined;
    revalidateOn?: ValidationMode | undefined;
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
    revalidateOn: ValidationMode;
};
export type FormStore<T, TResponseData extends ResponseData<T>> = {
    internal: InternalFormStore<T>;
    schema: unknown;
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
export {};
