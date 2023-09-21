import { Signal, createContextId } from "@builder.io/qwik";
import { JSONSchema7 } from "json-schema";

export const SchemaContext = createContextId<Signal<JSONSchema7>>("Schema");
