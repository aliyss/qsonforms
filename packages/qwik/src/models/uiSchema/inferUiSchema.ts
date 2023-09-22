import { JSONSchema7Definition } from "json-schema";
import { TemplateType } from "../../types";

export function inferUiSchemaSingle(
  schema: JSONSchema7Definition | JSONSchema7Definition[] | undefined,
  scope: string,
): { type: TemplateType.CONTROL | TemplateType.ARRAY; scope: string } {
  if (typeof schema === "boolean" || Array.isArray(schema) || !schema) {
    return {
      type: TemplateType.CONTROL,
      scope: scope,
    };
  }
  switch (schema.type) {
    case "array": {
      return {
        type: TemplateType.ARRAY,
        scope: scope,
      };
    }
    case "null":
    case "string":
    case "integer":
    case "boolean":
    case "number":
    default: {
      return {
        type: TemplateType.CONTROL,
        scope: scope,
      };
    }
  }
}
