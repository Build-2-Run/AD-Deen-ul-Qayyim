import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../utils/cn";

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  gap?: number | string;
}

/**
 * Grid provides a strictly typed CSS grid container.
 */
export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, asChild = false, cols, gap, style, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (
      <Comp
        ref={ref}
        className={cn(
          "grid",
          {
            "grid-cols-1": cols === 1,
            "grid-cols-2": cols === 2,
            "grid-cols-3": cols === 3,
            "grid-cols-4": cols === 4,
            "grid-cols-5": cols === 5,
            "grid-cols-6": cols === 6,
            "grid-cols-7": cols === 7,
            "grid-cols-8": cols === 8,
            "grid-cols-9": cols === 9,
            "grid-cols-10": cols === 10,
            "grid-cols-11": cols === 11,
            "grid-cols-12": cols === 12,
          },
          className
        )}
        style={{ gap: gap ? (typeof gap === 'number' ? `${gap * 0.25}rem` : gap) : undefined, ...style }}
        {...props}
      />
    );
  }
);
Grid.displayName = "Grid";
