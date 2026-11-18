import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-[var(--radius-inner)] border border-[var(--color-rule)] bg-[var(--color-paper-2)] px-3.5 py-2 text-base text-[var(--color-ink)] file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[var(--color-muted)] focus-visible:outline-none focus-visible:border-[var(--color-accent)] focus-visible:ring-1 focus-visible:ring-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm transition-colors",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
