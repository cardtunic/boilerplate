import { defineWorkersConfig } from "@cloudflare/vitest-pool-workers/config";
import { fileURLToPath } from "node:url";

export default defineWorkersConfig({
  resolve: {
    alias: {
      $api: fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    poolOptions: {
      workers: {
        wrangler: { configPath: "./wrangler.jsonc" },
      },
    },
  },
});
