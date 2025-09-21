"use client";

import { useConvexAuth } from "convex/react";
import { useEffect, useRef } from "react";

const LAST_PROVIDER_KEY = "devquest-blog-last-auth-provider";
const PENDING_PROVIDER_KEY = "devquest-blog-pending-provider";

export function AuthSuccessHandler() {
  const { isAuthenticated } = useConvexAuth();
  const wasAuthenticated = useRef(false);

  useEffect(() => {
    if (
      isAuthenticated &&
      !wasAuthenticated.current &&
      typeof window !== "undefined"
    ) {
      const pendingProvider = localStorage.getItem(PENDING_PROVIDER_KEY);

      if (pendingProvider === "google" || pendingProvider === "discord") {
        localStorage.setItem(LAST_PROVIDER_KEY, pendingProvider);
        localStorage.removeItem(PENDING_PROVIDER_KEY);
      }
    }

    wasAuthenticated.current = isAuthenticated;
  }, [isAuthenticated]);

  return null;
}
