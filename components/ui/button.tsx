import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md font-normal text-md outline-none transition-all focus-visible:border-system-info focus-visible:ring-[3px] focus-visible:ring-system-info/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-system-danger aria-invalid:ring-system-danger/20 dark:aria-invalid:ring-system-danger/40 [&_svg:not([class*='size-'])]:size-5 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "border border-neutral-200 bg-system-white text-neutral-900 hover:bg-system-white/90 hover:shadow-xs",
        secondary:
          "bg-neutral-900 text-system-white hover:bg-neutral-900/90 hover:shadow-xs",
        outline:
          "border border-neutral-200 bg-transparent text-neutral-600 hover:shadow-xs",
        ghost: "bg-transparent text-neutral-600 hover:text-neutral-900",
        link: "text-neutral-600 hover:text-neutral-900",
        destructive:
          "bg-system-danger text-white shadow-xs hover:bg-system-danger/90 focus-visible:ring-system-danger/20",
      },
      size: {
        default: "h-14 px-7 py-4",
        xs: "h-11 px-3 py-2.5",
        sm: "h-13 px-6 py-3",
        lg: "h-14 px-14 py-4",
        icon: "size-12 rounded-full",
        auto: "size-auto",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      data-slot="button"
      {...props}
    />
  );
}

export { Button, buttonVariants };
