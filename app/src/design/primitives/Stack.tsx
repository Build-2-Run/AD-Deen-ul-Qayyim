import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../utils/cn";

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
  space?: number | string;
  align?: "start" | "center" | "end" | "stretch";
}

/**
 * Stack is a flex-col component with consistent vertical spacing.
 */
export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  ({ className, asChild = false, space = 4, align, style, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (
      <Comp
        ref={ref}
        className={cn(
          "flex flex-col",
          {
            "items-start": align === "start",
            "items-center": align === "center",
            "items-end": align === "end",
            "items-stretch": align === "stretch",
          },
          className
        )}
        style={{ gap: typeof space === 'number' ? `${space * 0.25}rem` : space, ...style }}
        {...props}
      />
    );
  }
);
Stack.displayName = "Stack";
