import React from "react";
import { BoxProps } from "../primitives/Box";
import { cn } from "../../utils/cn";

export interface DividerProps extends BoxProps {
  orientation?: "horizontal" | "vertical";
}

export const Divider = React.forwardRef<HTMLHRElement | HTMLDivElement, DividerProps>(
  ({ className, orientation = "horizontal", ...props }, ref) => {
    if (orientation === "horizontal") {
      return (
        <hr
          ref={ref as any}
          className={cn("border-t border-[var(--border)] w-full my-4", className)}
          {...props as any}
        />
      );
    }
    
    return (
      <div
        ref={ref as any}
        className={cn("border-l border-[var(--border)] h-full mx-4", className)}
        {...props}
      />
    );
  }
);
Divider.displayName = "Divider";
