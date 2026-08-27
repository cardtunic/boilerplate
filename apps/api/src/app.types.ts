import type { Runtime } from "$api/effect/buildRuntime";
import type { AuthSession } from "$api/auth/auth";

export type AppBindings = { runtime: Runtime } & Cloudflare.Env;

export type AppVariables = {
  user: AuthSession["user"] | null;
  session: AuthSession["session"] | null;
};

export type AppEnv = {
  Bindings: AppBindings;
  Variables: AppVariables;
};
