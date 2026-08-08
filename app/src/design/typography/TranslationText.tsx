import React from "react";
import { Text, TextProps } from "../primitives/Text";
import { cn } from "../../utils/cn";

export interface TranslationTextProps extends Omit<TextProps, "variant"> {
  language?: string;
}

/**
 * TranslationText provides elegant serif styling for long-form translated meaning.
 */
export const TranslationText = React.forwardRef<HTMLSpanElement, TranslationTextProps>(
  ({ className, language = "en", size = "base", ...props }, ref) => {
    return (
      <Text
        ref={ref}
        className={cn(
          "leading-relaxed",
          // Use serif body font for classic translations, or adapt per language
          className
        )}
        variant="secondary"
        size={size}
        dir={language === "ur" || language === "ar" ? "rtl" : "ltr"}
        {...props}
      />
    );
  }
);
TranslationText.displayName = "TranslationText";
