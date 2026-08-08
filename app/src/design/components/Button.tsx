import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../utils/cn";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90": variant === "primary",
            "border border-[var(--border)] bg-transparent hover:bg-[var(--surface)]": variant === "secondary",
            "hover:bg-[var(--border)] hover:text-[var(--text-primary)]": variant === "ghost",
            "h-8 px-3 text-xs": size === "sm",
            "h-10 px-4 py-2 text-sm": size === "md",
            "h-12 px-8 text-base": size === "lg",
            "h-10 w-10": size === "icon", // For IconButtons
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export const IconButton = React.forwardRef<HTMLButtonElement, Omit<ButtonProps, "size">>(
  ({ className, variant = "ghost", ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant={variant}
        size="icon"
        className={cn("rounded-full", className)}
        {...props}
      />
    );
  }
);
IconButton.displayName = "IconButton";
