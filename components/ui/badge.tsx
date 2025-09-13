import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap rounded-full border px-3 py-1.5 font-medium text-xs transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-system-info/50 aria-invalid:border-system-danger aria-invalid:ring-system-danger/20 dark:aria-invalid:ring-system-danger/40 [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        default: "h-7 border-transparent bg-neutral-100 text-neutral-900",
        secondary:
          "h-8 rounded-md border-transparent bg-system-white px-2.5 py-1 text-base text-neutral-600",
        tertiary:
          "h-6 rounded-md border-transparent bg-neutral-100 px-1.5 py-1 text-neutral-900",
        outline:
          "h-10 rounded-md border-neutral-200 bg-system-white px-4.5 py-2 font-normal text-base text-neutral-900",
        highlight:
          "h-4 border-transparent bg-[#C7FFE9] px-1.5 py-0.5 text-[#0E7B4F] text-[10px] uppercase [&>svg]:size-2.5 [&>svg]:fill-[#0E0E0F] [&>svg]:text-[#0E0E0F]",
        destructive: "border-transparent bg-system-danger text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      className={cn(badgeVariants({ variant }), className)}
      data-slot="badge"
      {...props}
    />
  );
}

export { Badge, badgeVariants };
