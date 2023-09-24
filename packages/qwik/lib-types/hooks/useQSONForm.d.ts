import type { JSX } from "@builder.io/qwik/jsx-runtime";
import type { FormProps } from "../components";
import type { FormOptions, FormStore, FromData, FromDataSchema, ResponseData } from "../types";
/**
 * Creates and returns the store of the form as well as a linked Form, Field
 * and FieldArray component.
 *
 * @param options The form options.
 *
 * @returns The store and linked components.
 */
export declare function useQSONForm<T extends FromDataSchema = FromDataSchema, TResponseData extends ResponseData<FromData<T>> = undefined>(schema: T, options: FormOptions<FromData<T>, TResponseData>): [
    FormStore<FromData<T>, TResponseData>,
    {
        QSONForm: (props: Omit<FormProps<FromData<T>, TResponseData>, "of" | "action">) => JSX.Element;
    }
];
