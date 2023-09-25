import type { JSX } from "@builder.io/qwik/jsx-runtime";
import type { FormProps } from "../components";
import type { FormOptions, FormStore, FromData, ResponseData } from "../types";
/**
 * Creates and returns the store of the form as well as a linked Form, Field
 * and FieldArray component.
 *
 * @param options The form options.
 *
 * @returns The store and linked components.
 */
export declare function useQSONForm<T, S, TResponseData extends ResponseData<FromData<S>> = undefined>(schema: T, options: FormOptions<FromData<S>, TResponseData>): [
    FormStore<T, FromData<S>, TResponseData>,
    {
        QSONForm: (props: Omit<FormProps<T, FromData<S>, TResponseData>, "of" | "action">) => JSX.Element;
    }
];
