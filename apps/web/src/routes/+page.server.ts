import { parseResponse } from "hono/client";
import type { PageServerLoad } from "./$types";
import { api } from "$lib";

export const load: PageServerLoad = async ({ platform }) => {
  const health = await parseResponse(api(platform).health.$get());

  return {
    health,
  };
};
