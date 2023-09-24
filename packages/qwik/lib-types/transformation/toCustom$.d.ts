import { type QRL } from "@builder.io/qwik";
import type { TransformField } from "../types";
/**
 * Value type of the transform mode.
 */
export type TransformMode = "input" | "change" | "blur";
/**
 * Value type of the transform options.
 */
export type TransformOptions = {
    on: TransformMode;
};
/**
 * See {@link toCustom$}
 */
export declare function toCustomQrl<T>(action: QRL<TransformField<T>>, { on: mode }: TransformOptions): QRL<TransformField<T>>;
/**
 * Creates a custom transformation functions.
 *
 * @param action The transform action.
 * @param options The transform options.
 *
 * @returns A transformation functions.
 */
export declare const toCustom$: <T>(first: TransformField<T>, rest_0: TransformOptions) => QRL<TransformField<T>>;
