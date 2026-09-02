import type { RequestEvent } from "@sveltejs/kit";
import { createAuthClient } from "better-auth/svelte";

export function createServerAuthClient(
  platform: RequestEvent["platform"],
  req: RequestEvent["request"],
) {
  if (!platform) throw new Error("Couldn't create auth client without Cloudflare platform.");

  return createAuthClient({
    baseURL: "https://api.internal",
    fetchOptions: {
      customFetchImpl: (input: URL | RequestInfo, init?: RequestInit) => {
        const cookies = req.headers.get("cookie");

        const headers = new Headers(init?.headers);
        if (cookies) headers.set("cookie", cookies);

        return platform.env.API.fetch(input, {
          ...init,
          headers,
        });
      },
    },
  });
}
