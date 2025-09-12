"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "../convex/_generated/api";

export default function Home() {
  return (
    <>
      <header className="sticky top-0 z-10 flex flex-row items-center justify-between border-slate-200 border-b-2 bg-neutral-50 p-4 dark:border-slate-800">
        Convex + Next.js + Convex Auth
        <SignOutButton />
      </header>
      <DiscordSignIn />
      <main className="flex flex-col gap-8 p-8">
        <h1 className="text-center font-bold text-4xl">
          Convex + Next.js + Convex Auth
        </h1>
        <Content />
      </main>
    </>
  );
}

function DiscordSignIn() {
  const { signIn } = useAuthActions();

  return <button onClick={() => void signIn("discord")}>Discord</button>;
}

function SignOutButton() {
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();
  const router = useRouter();
  return (
    <>
      {isAuthenticated && (
        <button
          className="rounded-md bg-slate-200 px-2 py-1 text-foreground dark:bg-slate-800"
          onClick={() =>
            void signOut().then(() => {
              router.push("/signin");
            })
          }
        >
          Sign out
        </button>
      )}
    </>
  );
}

function Content() {
  const { viewer, numbers } =
    useQuery(api.myFunctions.listNumbers, {
      count: 10,
    }) ?? {};
  const addNumber = useMutation(api.myFunctions.addNumber);

  if (viewer === undefined || numbers === undefined) {
    return (
      <div className="mx-auto">
        <p>loading... (consider a loading skeleton)</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-8">
      <p>Welcome {viewer ?? "Anonymous"}!</p>
      <p>
        Click the button below and open this page in another window - this data
        is persisted in the Convex cloud database!
      </p>
      <p>
        <button
          className="rounded-md bg-foreground px-4 py-2 text-background text-sm"
          onClick={() => {
            void addNumber({ value: Math.floor(Math.random() * 10) });
          }}
        >
          Add a random number
        </button>
      </p>
      <p>
        Numbers:{" "}
        {numbers?.length === 0
          ? "Click the button!"
          : (numbers?.join(", ") ?? "...")}
      </p>
      <p>
        Edit{" "}
        <code className="rounded-md bg-slate-200 px-1 py-0.5 font-bold font-mono text-sm dark:bg-slate-800">
          convex/myFunctions.ts
        </code>{" "}
        to change your backend
      </p>
      <p>
        Edit{" "}
        <code className="rounded-md bg-slate-200 px-1 py-0.5 font-bold font-mono text-sm dark:bg-slate-800">
          app/page.tsx
        </code>{" "}
        to change your frontend
      </p>
      <p>
        See the{" "}
        <Link className="underline hover:no-underline" href="/server">
          /server route
        </Link>{" "}
        for an example of loading data in a server component
      </p>
      <div className="flex flex-col">
        <p className="font-bold text-lg">Useful resources:</p>
        <div className="flex gap-2">
          <div className="flex w-1/2 flex-col gap-2">
            <ResourceCard
              description="Read comprehensive documentation for all Convex features."
              href="https://docs.convex.dev/home"
              title="Convex docs"
            />
            <ResourceCard
              description="Learn about best practices, use cases, and more from a growing
            collection of articles, videos, and walkthroughs."
              href="https://www.typescriptlang.org/docs/handbook/2/basic-types.html"
              title="Stack articles"
            />
          </div>
          <div className="flex w-1/2 flex-col gap-2">
            <ResourceCard
              description="Browse our collection of templates to get started quickly."
              href="https://www.convex.dev/templates"
              title="Templates"
            />
            <ResourceCard
              description="Join our developer community to ask questions, trade tips & tricks,
            and show off your projects."
              href="https://www.convex.dev/community"
              title="Discord"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ResourceCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <div className="flex h-28 flex-col gap-2 overflow-auto rounded-md bg-slate-200 p-4 dark:bg-slate-800">
      <a className="text-sm underline hover:no-underline" href={href}>
        {title}
      </a>
      <p className="text-xs">{description}</p>
    </div>
  );
}
