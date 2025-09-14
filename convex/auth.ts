import Discord from "@auth/core/providers/discord";
import { Password } from "@convex-dev/auth/providers/Password";

import { convexAuth } from "@convex-dev/auth/server";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Password,
    Discord({
      clientId: process.env.DISCORD_AUTH_CLIENT_ID ?? "",
      clientSecret: process.env.DISCORD_AUTH_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async afterUserCreatedOrUpdated(ctx, args) {
      await ctx.db.insert("userProfiles", {
        userId: args.userId,
        role: "user",
      });
    },
  },
});
