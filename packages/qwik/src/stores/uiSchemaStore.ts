import { Signal, createContextId } from "@builder.io/qwik";
import { UiSchema } from "../models/uiSchema/build";

export const UiSchemaContext = createContextId<Signal<UiSchema>>("UiSchema");
