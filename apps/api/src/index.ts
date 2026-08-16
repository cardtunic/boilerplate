import { app } from "./app";

export default {
  async fetch(request, env, _): Promise<Response> {
    return app.fetch(request, env);
  },
} satisfies ExportedHandler<Env>;
