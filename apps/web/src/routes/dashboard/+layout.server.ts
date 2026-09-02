import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import { createServerAuthClient } from "$lib/server/createServerAuthClient";

export const load: LayoutServerLoad = async ({ request, platform }) => {
  const authClient = createServerAuthClient(platform, request);
  const result = await authClient.getSession();

  if (!result.data || result.error) redirect(307, "/login");

  return {
    user: result.data.user,
  };
};
