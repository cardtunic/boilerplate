import { parseResponse } from "hono/client";
import type { PageServerLoad } from "./$types";
import { api } from "$lib";

export const load: PageServerLoad = async ({ platform }) => {
  const greeting = await parseResponse(api(platform).test.$get());

  return {
    greeting,
  };
};
