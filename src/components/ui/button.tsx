import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-ios cursor-pointer disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-b from-primary to-primary/85 text-primary-foreground border border-primary/40 shadow-ios-md hover:shadow-ios-lg hover:from-primary/95 hover:to-primary/80",
        destructive:
          "bg-gradient-to-b from-destructive to-destructive/80 text-destructive-foreground border border-destructive/40 hover:from-destructive/95 hover:to-destructive/75 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 shadow-ios-md hover:shadow-ios-lg",
        outline:
          "border border-border/80 bg-card/60 shadow-ios hover:bg-accent/60 hover:text-accent-foreground dark:bg-input/40 dark:border-input/60 dark:hover:bg-input/60",
        secondary:
          "bg-secondary/80 text-secondary-foreground hover:bg-secondary/70 shadow-ios hover:shadow-ios-md",
        soft: "bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30 shadow-ios",
        ghost: "hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-11 sm:h-10 px-5 py-2.5 sm:py-2.5 has-[>svg]:px-4 touch-manipulation text-base sm:text-sm",
        sm: "h-10 sm:h-9 rounded-lg gap-1.5 px-4 has-[>svg]:px-3 touch-manipulation text-sm",
        lg: "h-14 sm:h-12 rounded-xl px-8 has-[>svg]:px-5 touch-manipulation text-lg sm:text-base font-semibold",
        icon: "size-11 sm:size-10 touch-manipulation rounded-lg",
        "icon-sm": "size-10 sm:size-9 touch-manipulation rounded-lg",
        "icon-lg": "size-14 sm:size-12 touch-manipulation rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
