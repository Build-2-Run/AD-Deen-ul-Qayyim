import React from "react";
import { Text, TextProps } from "../primitives/Text";

export const Body = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Text asChild className={className} {...props}>
        <p ref={ref}>{children}</p>
      </Text>
    );
  }
);
Body.displayName = "Body";

export const SubHeading = React.forwardRef<HTMLHeadingElement, TextProps>(
  ({ className, size = "lg", weight = "medium", variant = "secondary", children, ...props }, ref) => {
    return (
      <Text asChild size={size} weight={weight} variant={variant} className={className} {...props}>
        <h3 ref={ref}>{children}</h3>
      </Text>
    );
  }
);
SubHeading.displayName = "SubHeading";

export const Caption = React.forwardRef<HTMLSpanElement, TextProps>(
  ({ className, size = "sm", variant = "secondary", ...props }, ref) => {
    return (
      <Text
        size={size}
        variant={variant}
        className={className}
        ref={ref}
        {...props}
      />
    );
  }
);
Caption.displayName = "Caption";

export const Label = React.forwardRef<HTMLLabelElement, TextProps & React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, size = "sm", weight = "medium", children, ...props }, ref) => {
    return (
      <Text asChild size={size} weight={weight} className={className} {...(props as any)}>
        <label ref={ref}>{children}</label>
      </Text>
    );
  }
);
Label.displayName = "Label";

export const Code = React.forwardRef<HTMLElement, TextProps>(
  ({ className, size = "sm", children, ...props }, ref) => {
    return (
      <Text
        asChild
        size={size}
        className={`font-mono bg-[var(--border)] px-1 py-0.5 rounded-sm ${className || ""}`}
        {...props}
      >
        <code ref={ref}>{children}</code>
      </Text>
    );
  }
);
Code.displayName = "Code";
