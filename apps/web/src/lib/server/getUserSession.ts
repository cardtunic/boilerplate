import type { authClient } from "$lib/authClient";
import type { RequestEvent } from "@sveltejs/kit";

type AuthSession = typeof authClient.$Infer.Session;

export async function getUserSession(
  event: Pick<RequestEvent, "platform" | "request">,
): Promise<AuthSession | null> {
  if (!event.platform) {
    throw new Error("Cannot get auth session without the Cloudflare platform.");
  }

  const cookie = event.request.headers.get("cookie");
  if (!cookie) return null;

  const response = await event.platform.env.API.fetch("https://api.internal/api/auth/get-session", {
    headers: { cookie },
  });

  if (!response.ok) {
    throw new Error(`Unable to get auth session: ${response.status}`);
  }

  return response.json<AuthSession | null>();
}
