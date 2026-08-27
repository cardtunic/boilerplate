import type { BetterAuthOptions } from "better-auth";
import { betterAuth } from "better-auth/minimal";

export const authConfig = {
  emailAndPassword: {
    enabled: true,
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
} satisfies BetterAuthOptions;

export const auth = betterAuth(authConfig);
