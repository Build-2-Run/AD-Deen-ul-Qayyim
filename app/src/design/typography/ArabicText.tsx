import React from "react";
import { Text, TextProps } from "../primitives/Text";
import { cn } from "../../utils/cn";

export interface ArabicTextProps extends Omit<TextProps, "variant" | "size" | "weight"> {
  size?: "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
}

/**
 * ArabicText prioritizes readability and proper rendering of Tashkeel.
 */
export const ArabicText = React.forwardRef<HTMLSpanElement, ArabicTextProps>(
  ({ className, size = "2xl", ...props }, ref) => {
    return (
      <Text
        ref={ref}
        className={cn(
          "font-[family-name:var(--font-arabic)] leading-loose text-right",
          {
            "text-sm": size === "sm",
            "text-base": size === "base",
            "text-lg": size === "lg",
            "text-xl": size === "xl",
            "text-2xl": size === "2xl",
            "text-3xl": size === "3xl",
            "text-4xl": size === "4xl",
            "text-5xl": size === "5xl",
          },
          className
        )}
        dir="rtl"
        {...props}
      />
    );
  }
);
ArabicText.displayName = "ArabicText";
