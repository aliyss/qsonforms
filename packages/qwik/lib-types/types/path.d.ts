import { FromData } from "./form";
export type TupleKeys<T extends Array<any>> = Exclude<keyof T, keyof any[]>;
export type IsTuple<T extends Array<any>> = number extends T["length"] ? false : true;
type ValuePath<TKey extends string | number, TValue> = TValue extends string[] ? `${TKey}` | `${TKey}.${ValuePaths<TValue>}` : TValue extends FromData<any> | Blob ? `${TKey}` : `${TKey}.${ValuePaths<TValue>}`;
type ValuePaths<TValue> = TValue extends Array<infer TChild> ? IsTuple<TValue> extends true ? {
    [TKey in TupleKeys<TValue>]-?: ValuePath<TKey & string, TValue[TKey]>;
}[TupleKeys<TValue>] : ValuePath<number, TChild> : {
    [TKey in keyof TValue]-?: ValuePath<TKey & string, TValue[TKey]>;
}[keyof TValue];
export type FieldPath<T> = ValuePaths<T>;
type ArrayPath<TKey extends string | number, Value> = Value extends Array<any> ? `${TKey}` | `${TKey}.${ArrayPaths<Value>}` : Value extends FromData<any> ? `${TKey}.${ArrayPaths<Value>}` : never;
type ArrayPaths<TValue> = TValue extends Array<infer TChild> ? IsTuple<TValue> extends true ? {
    [TKey in TupleKeys<TValue>]-?: ArrayPath<TKey & string, TValue[TKey]>;
}[TupleKeys<TValue>] : ArrayPath<number, TChild> : {
    [TKey in keyof TValue]-?: ArrayPath<TKey & string, TValue[TKey]>;
}[keyof TValue];
type PathValue<TValue, TPath> = TPath extends `${infer TKey1}.${infer TKey2}` ? TKey1 extends keyof TValue ? TKey2 extends ValuePaths<TValue[TKey1]> | ArrayPaths<TValue[TKey1]> ? PathValue<TValue[TKey1], TKey2> : never : TKey1 extends `${number}` ? TValue extends Array<infer TChild> ? PathValue<TChild, TKey2 & (ValuePaths<TChild> | ArrayPaths<TChild>)> : never : never : TPath extends keyof TValue ? TValue[TPath] : never;
export type FieldPathValue<T, TFieldPath extends FieldPath<T>> = PathValue<T, TFieldPath>;
export {};
