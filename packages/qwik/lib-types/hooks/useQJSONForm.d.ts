import type { JSX } from "@builder.io/qwik/jsx-runtime";
import type { FormProps } from "../components";
import type { FormOptions, FormStore, FromData, ResponseData } from "../types";
import { JSONSchema7 } from "json-schema";
/**
 * Creates and returns the store of the form as well as a linked Form, Field
 * and FieldArray component.
 *
 * @param options The form options.
 *
 * @returns The store and linked components.
 */
export declare function useQJSONForm<T extends JSONSchema7 = JSONSchema7, TResponseData extends ResponseData<FromData<T>> = undefined>(schema: T, options: FormOptions<FromData<T>, TResponseData>): [
    FormStore<FromData<T>, TResponseData>,
    {
        QJSONForm: (props: Omit<FormProps<FromData<T>, TResponseData>, "of" | "action">) => JSX.Element;
    }
];
