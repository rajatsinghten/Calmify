import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-[var(--radius-pill)] border px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-[var(--color-accent)] text-[var(--color-accent-ink)] font-semibold",
        secondary: "border-[var(--color-rule)] bg-[var(--color-paper-2)] text-[var(--color-ink)]",
        destructive: "border-[oklch(38%_0.08_25)] bg-[oklch(22%_0.05_25)] text-[oklch(84%_0.10_25)]",
        outline: "border-[var(--color-rule)] text-[var(--color-muted)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
