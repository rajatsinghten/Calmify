import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 rounded-[var(--radius-pill)]",
  {
    variants: {
      variant: {
        default: "bg-[var(--color-accent)] text-[var(--color-accent-ink)] hover:bg-[var(--color-accent-hi)] font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]",
        destructive: "bg-[oklch(22%_0.05_25)] text-[oklch(84%_0.10_25)] border border-[oklch(38%_0.08_25)] hover:bg-[oklch(26%_0.06_25)]",
        outline: "border border-[var(--color-rule)] bg-[var(--color-paper-2)] text-[var(--color-ink)] hover:bg-[var(--color-paper-3)] hover:text-[var(--color-ink)]",
        secondary: "bg-[var(--color-paper-2)] text-[var(--color-ink)] hover:bg-[var(--color-paper-3)] border border-[var(--color-rule)]",
        ghost: "hover:bg-[var(--color-paper-2)] text-[var(--color-ink-2)] hover:text-[var(--color-ink)]",
        link: "text-[var(--color-accent)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-9 px-3.5 text-xs",
        lg: "h-12 px-7 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
