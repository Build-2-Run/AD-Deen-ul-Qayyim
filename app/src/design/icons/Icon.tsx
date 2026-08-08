import React from "react";
import { LucideIcon, icons } from "lucide-react";
import { cn } from "../../utils/cn";

export type IconName = string;

export interface IconProps extends React.SVGAttributes<SVGSVGElement> {
  name: IconName;
  size?: number | string;
  variant?: "primary" | "secondary" | "accent" | "success" | "warning" | "error" | "info" | "inherit";
}

/**
 * Unified ADQ Icon Wrapper ensuring stroke widths, sizes, and colors are globally consistent.
 */
export const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ name, size = 24, variant = "inherit", className, ...props }, ref) => {
    const LucideComponent = icons[name as keyof typeof icons] as LucideIcon;
    
    if (!LucideComponent) {
      console.warn(`Icon ${name} not found in lucide-react`);
      return null;
    }

    return (
      <LucideComponent
        ref={ref}
        size={size}
        className={cn(
          {
            "text-[var(--text-primary)]": variant === "primary",
            "text-[var(--text-secondary)]": variant === "secondary",
            "text-[var(--accent)]": variant === "accent",
            "text-[var(--success)]": variant === "success",
            "text-[var(--warning)]": variant === "warning",
            "text-[var(--error)]": variant === "error",
            "text-[var(--info)]": variant === "info",
          },
          className
        )}
        // Enforce consistent stroke width for the platform
        strokeWidth={2}
        {...props}
      />
    );
  }
);
Icon.displayName = "Icon";
