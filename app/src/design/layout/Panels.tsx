import React from "react";
import { Surface, SurfaceProps } from "../primitives/Surface";
import { cn } from "../../utils/cn";

export const Sidebar = React.forwardRef<HTMLDivElement, SurfaceProps>(
  ({ className, ...props }, ref) => {
    return (
      <Surface
        ref={ref}
        elevation="low"
        rounded="none"
        className={cn(
          "hidden md:flex flex-col w-64 h-screen border-r border-[var(--border)] shrink-0 overflow-y-auto",
          className
        )}
        {...props}
      />
    );
  }
);
Sidebar.displayName = "Sidebar";

export const Panel = React.forwardRef<HTMLDivElement, SurfaceProps>(
  ({ className, ...props }, ref) => {
    return (
      <Surface
        ref={ref}
        elevation="medium"
        className={cn(
          "flex flex-col h-full overflow-y-auto",
          className
        )}
        {...props}
      />
    );
  }
);
Panel.displayName = "Panel";

export const BottomSheet = React.forwardRef<HTMLDivElement, SurfaceProps>(
  ({ className, ...props }, ref) => {
    return (
      <Surface
        ref={ref}
        elevation="glass"
        rounded="lg" // Usually top corners rounded, bottom square. Handled in usage via Tailwind or specifically here.
        className={cn(
          "fixed bottom-0 left-0 right-0 max-h-[90vh] overflow-y-auto rounded-t-2xl rounded-b-none border-b-0",
          className
        )}
        {...props}
      />
    );
  }
);
BottomSheet.displayName = "BottomSheet";
