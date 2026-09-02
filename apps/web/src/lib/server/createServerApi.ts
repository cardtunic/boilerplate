import type { RequestEvent } from "@sveltejs/kit";
import { hc } from "hono/client";
import type { AppType } from "api/rpc";

export function createServerApi(
  platform: RequestEvent["platform"],
  req: RequestEvent["request"],
) {
  if (!platform)
    throw Error("Couldn't create api without Cloudflare platform.");

  return hc<AppType>("https://api.internal", {
    fetch: (input: URL | RequestInfo, init?: RequestInit) => {
      const cookies = req.headers.get("cookie");

      const headers = new Headers(init?.headers);
      if (cookies) headers.set("cookie", cookies);

      return platform.env.API.fetch(input, {
        ...init,
        headers,
      });
    },
  }).api;
}
