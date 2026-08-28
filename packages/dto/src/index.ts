import * as v from "valibot";

const email = v.pipe(v.string(), v.email("Invalid email"));
const password = v.pipe(
  v.string(),
  v.minLength(8, "Password min. length is 8"),
);

export const LoginDto = v.object({
  email: email,
  password: password,
});

export type LoginDto = v.InferInput<typeof LoginDto>;

export const RegisterDto = v.object({
  name: v.pipe(v.string(), v.nonEmpty("Name cannot be empty")),
  email: email,
  password: password,
});

export type RegisterDto = v.InferInput<typeof RegisterDto>;
