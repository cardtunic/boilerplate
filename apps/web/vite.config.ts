import adapter from "@sveltejs/adapter-cloudflare";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      sveltekit({
        compilerOptions: {
          // Force runes mode for the project, except for libraries. Can be removed in svelte 6.
          runes: ({ filename }) =>
            filename.split(/[/\\]/).includes("node_modules") ? undefined : true,
        },

        adapter: adapter(),
      }),
    ],

    ...(env.PROXY_API_ORIGIN
      ? {
          server: {
            proxy: {
              "/api": {
                target: env.PROXY_API_ORIGIN,
                changeOrigin: true,
                secure: env.PROXY_API_ORIGIN.startsWith("https://"),
              },
            },
          },
        }
      : {}),
  };
});
