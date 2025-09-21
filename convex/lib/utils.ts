import type { MutationCtx, QueryCtx } from "../_generated/server";

export function getImageUrl(_ctx: QueryCtx, image: string): string {
  return image;
}

export function getUserImageUrl(_ctx: QueryCtx, user: any): string {
  return user?.image || "";
}

export async function generateUploadUrl(ctx: MutationCtx) {
  return await ctx.storage.generateUploadUrl();
}
