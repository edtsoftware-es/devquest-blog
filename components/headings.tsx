import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

export function Heading({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg
        aria-hidden="true"
        className="text-primary-foreground"
        fill="currentColor"
        height="23"
        viewBox="0 0 24 23"
        width="24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>Decorative star icon</title>
        <path d="M0.5818 11.7288C8.79426 13.4715 10.2517 14.8616 12.1247 22.7374C13.8064 14.8771 15.2306 13.4995 23.4016 11.8281C15.1891 10.0854 13.7317 8.69528 11.8587 0.819485C10.1767 8.67981 8.75282 10.0574 0.5818 11.7288Z" />
      </svg>
      <h5 className="text-heading-5">{children}</h5>
    </div>
  );
}

export function SectionHeading({
  title,
  subtitle,
  slug,
}: {
  title: string;
  subtitle: string;
  slug: string;
}) {
  return (
    <div className="flex w-full items-center justify-between rounded-[10px] border border-neutral-200 bg-primary px-4 py-4 md:px-8">
      <div className="flex flex-col items-start md:flex-row md:items-center md:gap-4 md:pl-8">
        <Heading className="mb-0 pl-0">{title}</Heading>
        <p className="items-center pt-1 text-muted-foreground text-sm">
          {subtitle}
        </p>
      </div>
      <Button asChild className="group w-fit" size="auto" variant="ghost">
        <Link href={`/blog/${slug}`}>
          <span className="rounded-full bg-neutral-900/90 p-1 text-system-white transition-colors group-hover:bg-neutral-900">
            <ChevronRight aria-hidden="true" />
          </span>
          <span className="hidden md:block">ver más</span>
        </Link>
      </Button>
    </div>
  );
}
