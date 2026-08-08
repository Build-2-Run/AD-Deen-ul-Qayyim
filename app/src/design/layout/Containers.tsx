import React from "react";
import { Box, BoxProps } from "../primitives/Box";
import { Flex } from "../primitives/Flex";
import { cn } from "../../utils/cn";

export const AppShell = React.forwardRef<HTMLDivElement, BoxProps>(
  ({ className, ...props }, ref) => {
    return (
      <Box
        ref={ref}
        className={cn("min-h-screen bg-[var(--background)] text-[var(--text-primary)] flex flex-col md:flex-row", className)}
        {...props}
      />
    );
  }
);
AppShell.displayName = "AppShell";

export const PageContainer = React.forwardRef<HTMLDivElement, BoxProps>(
  ({ className, ...props }, ref) => {
    return (
      <Flex
        direction="col"
        ref={ref}
        className={cn("flex-1 min-h-screen overflow-x-hidden relative", className)}
        {...props}
      />
    );
  }
);
PageContainer.displayName = "PageContainer";

export const ContentContainer = React.forwardRef<HTMLDivElement, BoxProps>(
  ({ className, ...props }, ref) => {
    return (
      <Box
        ref={ref}
        className={cn("w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", className)}
        {...props}
      />
    );
  }
);
ContentContainer.displayName = "ContentContainer";

export const ReaderContainer = React.forwardRef<HTMLDivElement, BoxProps>(
  ({ className, ...props }, ref) => {
    return (
      <Box
        ref={ref}
        className={cn("w-full max-w-3xl mx-auto px-4 sm:px-6 py-12", className)}
        {...props}
      />
    );
  }
);
ReaderContainer.displayName = "ReaderContainer";

export const Section = React.forwardRef<HTMLElement, BoxProps>(
  ({ className, ...props }, ref) => {
    return (
      <Box
        asChild
        className={cn("py-12 border-b border-[var(--border)] last:border-0", className)}
        {...props}
      >
        <section ref={ref} />
      </Box>
    );
  }
);
Section.displayName = "Section";
