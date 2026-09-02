import { hc } from "hono/client";
import type { AppType } from "api/rpc";

export function api(platform?: Readonly<App.Platform> | undefined, request?: Request) {
  if (!import.meta.env.SSR) return hc<AppType>(window.location.origin).api;

  if (!platform) throw new Error("Can't created API on server without platform.");

  return hc<AppType>("https://api.internal", {
    fetch: (input: URL | RequestInfo, init?: RequestInit) => {
      const headers = new Headers(init?.headers);

      if (request) headers.set("cookie", request.headers.get("cookie") ?? "");

      return platform.env.API.fetch(input, {
        ...init,
        headers,
      });
    },
  }).api;
}
