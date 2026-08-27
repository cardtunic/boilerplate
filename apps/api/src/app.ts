import { Hono } from "hono";
import type { AppEnv } from "$api/app.types";
import { Effect } from "effect";
import Auth from "$api/auth/auth";
import { ensureAuth } from "./auth/ensureAuth";

export const app = new Hono<AppEnv>()
  .get("/api/health", (c) => c.text("Healthy!", 200))
  .all("/api/auth/*", (c) =>
    c.env.runtime.runPromise(
      Auth.pipe(Effect.map((auth) => auth.handler(c.req.raw))),
    ),
  )
  .get("/api/protected", ensureAuth, (c) => c.text("Protected."));

export type AppType = typeof app;
