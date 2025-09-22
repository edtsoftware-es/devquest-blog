import { cn } from "@/lib/utils";

function AuthorCard({ className, ...props }: React.ComponentProps<"article">) {
  return (
    <article
      className={cn(
        "relative isolate flex max-w-95 flex-col items-center gap-y-6 rounded-[1rem] border border-neutral-200 bg-primary px-6 xs:px-12 py-10 xs:py-20 transition-border duration-300 hover:border-neutral-600",
        className
      )}
      {...props}
    />
  );
}

function AuthorCardImageContainer({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex size-38 shrink-0 overflow-hidden rounded-full bg-neutral-200",
        className
      )}
      {...props}
    />
  );
}

function AuthorCardName({ className, ...props }: React.ComponentProps<"h2">) {
  return (
    <h2
      className={cn(
        "line-clamp-2 text-center font-semibold text-[1.5625rem] text-neutral-900 leading-[1.2]",
        className
      )}
      {...props}
    />
  );
}

function AuthorCardNickname({
  className,
  ...props
}: React.ComponentProps<"h3">) {
  return (
    <h3
      className={cn(
        "line-clamp-1 text-center font-semibold text-[1.125rem] text-neutral-600 leading-[1.2]",
        className
      )}
      {...props}
    />
  );
}

function AuthorCardDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "line-clamp-8 text-center font-normal text-[0.875rem] text-neutral-600 leading-[1.5]",
        className
      )}
      {...props}
    />
  );
}

export {
  AuthorCard,
  AuthorCardImageContainer,
  AuthorCardName,
  AuthorCardNickname,
  AuthorCardDescription,
};
