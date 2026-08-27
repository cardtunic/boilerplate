import { app } from "$api/app";
import { buildRuntime } from "$api/effect/buildRuntime";
import type { AppBindings } from "$api/app.types";

export default {
  async fetch(request, env, _): Promise<Response> {
    const { runtime } = buildRuntime(env);

    const newEnv = {
      ...env,
      runtime,
    } satisfies AppBindings;

    return app.fetch(request, newEnv);
  },
} satisfies ExportedHandler<Env>;
