import { NoSerialize, Signal } from "@builder.io/qwik";
import Ajv from "ajv";
export interface ValidatorStore {
    ajv: NoSerialize<Ajv>;
}
export declare const ValidatorContext: import("@builder.io/qwik").ContextId<Signal<any>>;
