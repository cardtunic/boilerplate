import { parseResponse } from "hono/client";
import type { PageServerLoad } from "./$types";
import { createServerApi } from "$lib/server/createServerApi";

export const load: PageServerLoad = async ({ platform, request }) => {
  const api = createServerApi(platform, request);
  const health = await parseResponse(api.health.$get());

  return {
    health,
  };
};
