import { Password } from "@convex-dev/auth/providers/Password";
import Discord from "@auth/core/providers/discord"

import { convexAuth } from "@convex-dev/auth/server";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Password, Discord({
    clientId: process.env.DISCORD_AUTH_CLIENT_ID!,
    clientSecret: process.env.DISCORD_AUTH_CLIENT_SECRET!,
  })],
});
