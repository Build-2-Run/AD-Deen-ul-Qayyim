import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../utils/cn";

export interface TextProps extends React.HTMLAttributes<HTMLSpanElement> {
  asChild?: boolean;
  variant?: "primary" | "secondary" | "accent" | "success" | "warning" | "error" | "info" | "inherit";
  size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  weight?: "normal" | "medium" | "semibold" | "bold";
  align?: "left" | "center" | "right" | "justify";
}

/**
 * Text is a basic typography primitive mapping to font sizes and colors.
 */
export const Text = React.forwardRef<HTMLSpanElement, TextProps>(
  (
    {
      className,
      asChild = false,
      variant = "primary",
      size = "base",
      weight = "normal",
      align,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "span";
    return (
      <Comp
        ref={ref}
        className={cn(
          {
            "text-[var(--text-primary)]": variant === "primary",
            "text-[var(--text-secondary)]": variant === "secondary",
            "text-[var(--accent)]": variant === "accent",
            "text-[var(--success)]": variant === "success",
            "text-[var(--warning)]": variant === "warning",
            "text-[var(--error)]": variant === "error",
            "text-[var(--info)]": variant === "info",
            
            "text-xs": size === "xs",
            "text-sm": size === "sm",
            "text-base": size === "base",
            "text-lg": size === "lg",
            "text-xl": size === "xl",
            "text-2xl": size === "2xl",
            "text-3xl": size === "3xl",
            "text-4xl": size === "4xl",
            
            "font-normal": weight === "normal",
            "font-medium": weight === "medium",
            "font-semibold": weight === "semibold",
            "font-bold": weight === "bold",
            
            "text-left": align === "left",
            "text-center": align === "center",
            "text-right": align === "right",
            "text-justify": align === "justify",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Text.displayName = "Text";
