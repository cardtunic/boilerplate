import type { AppEnv } from "$api/app.types";
import { createMiddleware } from "hono/factory";
import Auth from "$api/auth/auth";
import { Effect } from "effect";

export const ensureAuth = createMiddleware<AppEnv>(async (c, next) => {
  const result = await c.env.runtime.runPromise(
    Auth.pipe(
      Effect.map((auth) => auth.api.getSession({ headers: c.req.raw.headers })),
    ),
  );

  if (!result) return c.body("Unauthorized", 401);

  c.set("user", result.user);
  c.set("session", result.session);

  await next();
});
