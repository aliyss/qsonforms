import { Component } from "@builder.io/qwik";
import { UiSchema } from "../../models/uiSchema/build";
import { JSONSchema7Object } from "json-schema";
import Ajv from "ajv";
export interface QJSONFormProps {
    schema: JSONSchema7Object;
    uiSchema: UiSchema;
    formData: any;
    validator?: Ajv;
}
export declare const QJSONForm: Component<QJSONFormProps>;
