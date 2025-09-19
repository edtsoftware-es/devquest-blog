import Discord from "@auth/core/providers/discord";
import Google from "@auth/core/providers/google";

import { convexAuth } from "@convex-dev/auth/server";
import {
  adjectives,
  colors,
  languages,
  uniqueNamesGenerator,
} from "unique-names-generator";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Discord({
      clientId: process.env.DISCORD_AUTH_CLIENT_ID ?? "",
      clientSecret: process.env.DISCORD_AUTH_CLIENT_SECRET ?? "",
    }),
    Google,
  ],
  callbacks: {
    async afterUserCreatedOrUpdated(ctx, args) {
      const user = await ctx.db.get(args.userId);
      if (!user) {
        return;
      }
      const randomNickname = uniqueNamesGenerator({
        dictionaries: [adjectives, colors, languages],
        separator: "-",
        style: "lowerCase",
      });
      await ctx.db.insert("userProfiles", {
        userId: args.userId,
        role: "user",
        avatarUrl: user.image,
        nickname: randomNickname,
      });
    },
  },
});
