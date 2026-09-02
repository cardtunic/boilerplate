import { hc } from "hono/client";
import type { AppType } from "api/rpc";

export function api() {
  return hc<AppType>(window.location.origin).api;
}
