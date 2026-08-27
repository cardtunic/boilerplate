import { getUserSession } from "$lib/server/getUserSession";
import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ platform, request }) => {
  const session = await getUserSession({ platform, request });

  if (session) return redirect(307, "/dashboard");
};
