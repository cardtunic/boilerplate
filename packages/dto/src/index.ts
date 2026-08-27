import * as v from "valibot";

export const LoginDto = v.object({
  email: v.pipe(v.string(), v.email()),
  password: v.pipe(v.string(), v.minLength(8)),
});

export type LoginDto = v.InferInput<typeof LoginDto>;

export const RegisterDto = v.object({
  name: v.pipe(v.string(), v.nonEmpty()),
  email: v.pipe(v.string(), v.email()),
  password: v.pipe(v.string(), v.minLength(8)),
});

export type RegisterDto = v.InferInput<typeof RegisterDto>;
