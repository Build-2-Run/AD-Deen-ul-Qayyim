import React from "react";
import { cn } from "../../utils/cn";
import { Icon } from "../icons/Icon";

export const Skeleton = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("animate-pulse rounded-md bg-[var(--border)]", className)}
        {...props}
      />
    );
  }
);
Skeleton.displayName = "Skeleton";

export const Loading = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { size?: number }>(
  ({ className, size = 24, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex justify-center items-center text-[var(--primary)]", className)}
        {...props}
      >
        <Icon name="Loader" size={size} className="animate-spin" />
      </div>
    );
  }
);
Loading.displayName = "Loading";
