import * as v from "valibot";

export const HashTextDto = v.object({
  text: v.pipe(v.string(), v.nonEmpty()),
});

export type HashTextDto = v.InferInput<typeof HashTextDto>;

export * from "./auth";
