import { NoSerialize, Signal, createContextId } from "@builder.io/qwik";
import Ajv from "ajv";

export interface ValidatorStore {
  ajv: NoSerialize<Ajv>;
}

export const ValidatorContext = createContextId<Signal<any>>("FormErrors");
