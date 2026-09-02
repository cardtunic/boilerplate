import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import { createServerAuthClient } from "$lib/server/createServerAuthClient";

export const load: LayoutServerLoad = async ({ platform, request }) => {
  const authClient = createServerAuthClient(platform, request);
  const result = await authClient.getSession();

  if (result.data) return redirect(307, "/dashboard");
};
