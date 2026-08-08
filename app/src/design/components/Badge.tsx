import React from "react";
import { cn } from "../../utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "primary" | "success" | "warning" | "error";
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
          {
            "border-transparent bg-[var(--surface)] text-[var(--text-primary)] hover:bg-[var(--border)]": variant === "default",
            "border-transparent bg-[var(--primary)] text-white hover:bg-[var(--accent)]": variant === "primary",
            "border-transparent bg-[var(--success)] text-white": variant === "success",
            "border-transparent bg-[var(--warning)] text-white": variant === "warning",
            "border-transparent bg-[var(--error)] text-white": variant === "error",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";

export const Tag = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, ...props }, ref) => {
    return (
      <Badge
        ref={ref}
        variant="default"
        className={cn("rounded-md font-medium text-[var(--text-secondary)] border-[var(--border)] bg-transparent", className)}
        {...props}
      />
    );
  }
);
Tag.displayName = "Tag";
