import { Hono } from "hono";

export const app = new Hono().get("/api/health", (c) =>
  c.text("Healthy!", 200),
);

export type AppType = typeof app;
