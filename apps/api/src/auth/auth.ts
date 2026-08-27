import { authConfig } from "$api/auth/auth.config";
import Database from "$api/database/database";
import * as schema from "$api/database/schema";
import Env from "$api/services/env";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { betterAuth } from "better-auth/minimal";
import { Effect } from "effect";

export default class Auth extends Effect.Service<Auth>()("Auth", {
  effect: Effect.gen(function* () {
    const env = yield* Env;
    const database = yield* Database;

    return betterAuth({
      ...authConfig,
      appName: env.BETTER_AUTH_APP_NAME,
      baseURL: env.BETTER_AUTH_URL,
      secret: env.BETTER_AUTH_SECRET,
      trustedOrigins: [env.WEB_ORIGIN],
      database: drizzleAdapter(database.$drizzle, {
        provider: "pg",
        schema,
      }),
    });
  }),
}) {}

export type AuthSession = NonNullable<
  Awaited<ReturnType<Auth["api"]["getSession"]>>
>;
