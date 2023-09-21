import { JSONSchema7, JSONSchema7Definition } from "json-schema";
/**
 * Map for storing refs and the respective schemas they are pointing to.
 */
export interface ReferenceSchemaMap {
    [ref: string]: JSONSchema7;
}
export declare const resolveData: (instance: any, dataPathSegments: string[]) => any;
/**
 * Finds all references inside the given schema.
 *
 * @param schema The {@link JsonSchema} to find the references in
 * @param result The initial result map, default: empty map (this parameter is used for recursion
 *               inside the function)
 * @param resolveTuples Whether arrays of tuples should be considered; default: false
 */
export declare const findAllRefs: (schema: JSONSchema7 | JSONSchema7Definition | undefined, result?: ReferenceSchemaMap, resolveTuples?: boolean) => ReferenceSchemaMap;
/**
 * Resolve the given schema path in order to obtain a subschema.
 * @param {JsonSchema} schema the root schema from which to start
 * @param {string} schemaPath the schema path to be resolved
 * @param {JsonSchema} rootSchema the actual root schema
 * @returns {JsonSchema} the resolved sub-schema
 */
export declare const resolveSchema: (schema: JSONSchema7, schemaPath: string, rootSchema: JSONSchema7) => JSONSchema7 | undefined;
