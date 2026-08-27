import { api } from "$lib";
import { parseResponse } from "hono/client";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ request, platform }) => {
  const result = await parseResponse(api(platform, request).protected.$get());

  return {
    protected: result,
  };
};
