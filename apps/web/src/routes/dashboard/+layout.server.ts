import { getUserSession } from "$lib/server/getUserSession";
import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ request, platform }) => {
  const result = await getUserSession({ request, platform });

  if (!result) redirect(307, "/login");

  return {
    user: result.user,
  };
};
