import Ajv, { Schema } from "ajv";
export declare const switchValidator: (newAjv?: Ajv) => Ajv;
export declare const addSchema: (schema: Schema, name?: string) => void;
export declare const validate: (schema: Schema, data: any) => boolean;
