import { JSONSchema7Definition } from "json-schema";
import { TemplateType } from "../../types";
export declare function inferUiSchemaSingle(schema: JSONSchema7Definition | JSONSchema7Definition[] | undefined, scope: string): {
    type: TemplateType.CONTROL | TemplateType.ARRAY;
    scope: string;
};
