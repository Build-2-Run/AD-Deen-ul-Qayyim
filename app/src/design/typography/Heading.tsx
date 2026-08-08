import React from "react";
import { Text, TextProps } from "../primitives/Text";
import { cn } from "../../utils/cn";

export interface HeadingProps extends TextProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, level = 1, size, weight = "bold", children, ...props }, ref) => {
    const Tag = `h${level}` as any;

    // Default sizes based on level if size isn't overridden
    let defaultSize: TextProps["size"] = "3xl";
    if (level === 2) defaultSize = "2xl";
    if (level === 3) defaultSize = "xl";
    if (level === 4) defaultSize = "lg";
    if (level === 5) defaultSize = "base";
    if (level === 6) defaultSize = "sm";

    return (
      <Text
        asChild
        size={size || defaultSize}
        weight={weight}
        className={cn("font-[family-name:var(--font-heading)]", className)}
        {...props}
      >
        <Tag ref={ref}>{children}</Tag>
      </Text>
    );
  }
);
Heading.displayName = "Heading";
