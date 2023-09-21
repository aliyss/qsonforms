/*
  The MIT License

  Copyright (c) 2017-2019 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/

import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import { decode } from "./path";
import { JSONSchema7, JSONSchema7Definition } from "json-schema";

/**
 * Map for storing refs and the respective schemas they are pointing to.
 */
export interface ReferenceSchemaMap {
  [ref: string]: JSONSchema7;
}

const isObjectSchema = (schema: JSONSchema7): boolean => {
  return schema.properties !== undefined;
};
const isArraySchema = (schema: JSONSchema7): boolean => {
  return schema.type === "array" && schema.items !== undefined;
};

export const resolveData = (instance: any, dataPathSegments: string[]): any => {
  if (dataPathSegments.length <= 0) {
    return instance;
  }

  return dataPathSegments.reduce((curInstance, decodedSegment) => {
    if (
      !curInstance ||
      !Object.prototype.hasOwnProperty.call(curInstance, decodedSegment)
    ) {
      return undefined;
    }

    return curInstance[decodedSegment];
  }, instance);
};

/**
 * Finds all references inside the given schema.
 *
 * @param schema The {@link JsonSchema} to find the references in
 * @param result The initial result map, default: empty map (this parameter is used for recursion
 *               inside the function)
 * @param resolveTuples Whether arrays of tuples should be considered; default: false
 */
export const findAllRefs = (
  schema: JSONSchema7 | JSONSchema7Definition | undefined,
  result: ReferenceSchemaMap = {},
  resolveTuples = false,
): ReferenceSchemaMap => {
  if (schema && typeof schema !== "boolean" && isObjectSchema(schema)) {
    Object.keys(schema.properties || {}).forEach((key) =>
      findAllRefs(schema.properties![key], result),
    );
  }
  if (schema && typeof schema !== "boolean" && isArraySchema(schema)) {
    if (Array.isArray(schema.items)) {
      if (resolveTuples) {
        const items: JSONSchema7Definition[] = schema.items;
        items.forEach((child) => findAllRefs(child, result));
      }
    } else {
      findAllRefs(schema.items, result);
    }
  }
  if (schema && typeof schema !== "boolean" && Array.isArray(schema.anyOf)) {
    const anyOf: JSONSchema7Definition[] = schema.anyOf;
    anyOf.forEach((child) => findAllRefs(child, result));
  }
  if (schema && typeof schema !== "boolean" && schema.$ref !== undefined) {
    result[schema.$ref] = schema;
  }

  return result;
};

const invalidSegment = (pathSegment: string) =>
  pathSegment === "#" || pathSegment === undefined || pathSegment === "";

/**
 * Resolve the given schema path in order to obtain a subschema.
 * @param {JsonSchema} schema the root schema from which to start
 * @param {string} schemaPath the schema path to be resolved
 * @param {JsonSchema} rootSchema the actual root schema
 * @returns {JsonSchema} the resolved sub-schema
 */
export const resolveSchema = (
  schema: JSONSchema7,
  schemaPath: string,
  rootSchema: JSONSchema7,
): JSONSchema7 | undefined => {
  const segments = schemaPath?.split("/").map(decode);
  return resolveSchemaWithSegments(schema, segments, rootSchema);
};

const resolveSchemaWithSegments = (
  schema: JSONSchema7,
  pathSegments: string[],
  rootSchema: JSONSchema7,
): JSONSchema7 | undefined => {
  if (isEmpty(schema)) {
    return undefined;
  }

  if (schema.$ref) {
    schema = resolveSchema(rootSchema, schema.$ref, rootSchema) as JSONSchema7;
  }

  if (!pathSegments || pathSegments.length === 0) {
    return schema;
  }

  const [segment, ...remainingSegments] = pathSegments;

  if (invalidSegment(segment)) {
    return resolveSchemaWithSegments(schema, remainingSegments, rootSchema);
  }

  const singleSegmentResolveSchema = get(schema, segment);

  const resolvedSchema = resolveSchemaWithSegments(
    singleSegmentResolveSchema,
    remainingSegments,
    rootSchema,
  );
  if (resolvedSchema) {
    return resolvedSchema;
  }

  if (segment === "properties" || segment === "items") {
    // Let's try to resolve the path, assuming oneOf/allOf/anyOf/then/else was omitted.
    // We only do this when traversing an object or array as we want to avoid
    // following a property which is named oneOf, allOf, anyOf, then or else.
    let alternativeResolveResult = undefined;

    const subSchemas = [].concat(
      // @ts-ignore
      schema.oneOf ?? [],
      schema.allOf ?? [],
      schema.anyOf ?? [],
      (schema as JSONSchema7).then ?? [],
      (schema as JSONSchema7).else ?? [],
    );

    for (const subSchema of subSchemas) {
      alternativeResolveResult = resolveSchemaWithSegments(
        subSchema,
        [segment, ...remainingSegments],
        rootSchema,
      );
      if (alternativeResolveResult) {
        break;
      }
    }
    return alternativeResolveResult;
  }

  return undefined;
};
