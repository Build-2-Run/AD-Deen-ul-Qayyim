import React from "react";
import { cn } from "../../utils/cn";

export interface SpacerProps extends React.HTMLAttributes<HTMLDivElement> {
  size: number | string;
  axis?: "horizontal" | "vertical";
}

/**
 * Spacer pushes elements apart by a specific amount.
 */
export const Spacer = React.forwardRef<HTMLDivElement, SpacerProps>(
  ({ className, size, axis = "vertical", style, ...props }, ref) => {
    const width = axis === "horizontal" ? (typeof size === 'number' ? `${size * 0.25}rem` : size) : 1;
    const height = axis === "vertical" ? (typeof size === 'number' ? `${size * 0.25}rem` : size) : 1;
    
    return (
      <div
        ref={ref}
        className={cn("block flex-none", className)}
        style={{ width, height, minWidth: width, minHeight: height, ...style }}
        {...props}
      />
    );
  }
);
Spacer.displayName = "Spacer";
