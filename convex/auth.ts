import Discord from "@auth/core/providers/discord";
import Google from "@auth/core/providers/google";

import { convexAuth } from "@convex-dev/auth/server";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Discord({
      clientId: process.env.DISCORD_AUTH_CLIENT_ID ?? "",
      clientSecret: process.env.DISCORD_AUTH_CLIENT_SECRET ?? "",
    }),
    Google,
  ],
});
