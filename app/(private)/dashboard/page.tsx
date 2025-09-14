"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function DashboardPage() {
  const posts = useQuery(api.posts.getPostsByUserRole, {});
  return <div>Dashboard {JSON.stringify(posts)}</div>;
}
