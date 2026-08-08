import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../utils/cn";

export interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
  direction?: "row" | "col" | "row-reverse" | "col-reverse";
  align?: "start" | "center" | "end" | "stretch" | "baseline";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  wrap?: "nowrap" | "wrap" | "wrap-reverse";
}

/**
 * Flex provides a strictly typed flexbox container.
 */
export const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
  (
    {
      className,
      asChild = false,
      direction = "row",
      align,
      justify,
      wrap = "nowrap",
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "div";
    
    return (
      <Comp
        ref={ref}
        className={cn(
          "flex",
          {
            "flex-row": direction === "row",
            "flex-col": direction === "col",
            "flex-row-reverse": direction === "row-reverse",
            "flex-col-reverse": direction === "col-reverse",
            "items-start": align === "start",
            "items-center": align === "center",
            "items-end": align === "end",
            "items-stretch": align === "stretch",
            "items-baseline": align === "baseline",
            "justify-start": justify === "start",
            "justify-center": justify === "center",
            "justify-end": justify === "end",
            "justify-between": justify === "between",
            "justify-around": justify === "around",
            "justify-evenly": justify === "evenly",
            "flex-nowrap": wrap === "nowrap",
            "flex-wrap": wrap === "wrap",
            "flex-wrap-reverse": wrap === "wrap-reverse",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Flex.displayName = "Flex";
