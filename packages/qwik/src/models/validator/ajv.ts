import Ajv, { Schema } from "ajv";

let ajv = new Ajv();
const DEFAULT_KEY = "qson-schema";

export const switchValidator = (newAjv: Ajv = ajv) => {
  ajv = newAjv;
  return ajv;
};

export const addSchema = (schema: Schema, name = DEFAULT_KEY) => {
  ajv.addSchema(schema, name);
};

export const validate = (schema: Schema, data: any) => {
  return ajv.validate(schema, data);
};
