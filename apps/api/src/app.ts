import { Hono } from "hono";

export const app = new Hono().get("/api/test", (c) => c.text("Hello, World!"));

export type AppType = typeof app;
