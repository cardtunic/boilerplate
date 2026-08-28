import { Hono } from "hono";
import type { AppEnv } from "$api/app.types";
import { Effect } from "effect";
import Auth from "$api/auth/auth";
import { ensureAuth } from "$api/auth/ensureAuth";
import { HashTextDto } from "dto";
import { sValidator } from "@hono/standard-validator";
import { createHash } from "node:crypto";

export const app = new Hono<AppEnv>()
  .get("/api/health", (c) => c.text("Healthy!", 200))
  .all("/api/auth/*", (c) =>
    c.env.runtime.runPromise(
      Auth.pipe(Effect.map((auth) => auth.handler(c.req.raw))),
    ),
  )
  /**
   * Route to demonstrate how the Hono RPC translate the different
   * return types (success and error)
   */
  .post("/api/hash", ensureAuth, sValidator("json", HashTextDto), (c) => {
    const rand = Math.floor(Math.random() * (1 - 0 + 1)) + 0;

    // Return an error randomly
    if (rand === 1)
      return c.json(
        {
          code: "TEST_ERROR" as const,
          message: "Generated error, randomly occurs.",
        },
        400,
      );

    return c.json(
      {
        hash: createHash("sha256")
          .update(c.req.valid("json").text)
          .digest("hex"),
      },
      200,
    );
  });

export type AppType = typeof app;
