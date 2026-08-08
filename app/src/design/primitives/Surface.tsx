import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../utils/cn";

export interface SurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
  elevation?: "none" | "low" | "medium" | "glass";
  rounded?: "none" | "sm" | "md" | "lg" | "full";
  interactive?: boolean;
}

/**
 * Surface represents an elevated or distinct background layer (e.g. Card background).
 */
export const Surface = React.forwardRef<HTMLDivElement, SurfaceProps>(
  (
    {
      className,
      asChild = false,
      elevation = "none",
      rounded = "md",
      interactive = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "div";
    return (
      <Comp
        ref={ref}
        className={cn(
          "bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)]",
          {
            "shadow-none": elevation === "none",
            "shadow-sm": elevation === "low",
            "shadow-[var(--shadow-medium)]": elevation === "medium",
            "shadow-[var(--shadow-glass)] backdrop-blur-md": elevation === "glass",
            "rounded-none": rounded === "none",
            "rounded-sm": rounded === "sm",
            "rounded-md": rounded === "md",
            "rounded-lg": rounded === "lg",
            "rounded-full": rounded === "full",
            "transition-[transform,box-shadow] duration-[var(--transition-essential)]": interactive,
            "hover:-translate-y-0.5 hover:shadow-[var(--shadow-medium)] cursor-pointer": interactive,
          },
          className
        )}
        {...props}
      />
    );
  }
);
Surface.displayName = "Surface";
