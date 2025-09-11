import {
  convexAuthNextjsMiddleware,
} from "@convex-dev/auth/nextjs/server";
import { NextResponse } from "next/server";


export default convexAuthNextjsMiddleware(async () => {
  return NextResponse.next();
});

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
