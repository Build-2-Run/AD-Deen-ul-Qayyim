import React from "react";
import { cn } from "../../utils/cn";
import { Icon } from "../icons/Icon";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text-primary)] ring-offset-[var(--background)] file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[var(--text-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-50 transition-shadow",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export const SearchInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        <Icon name="Search" size={18} className="absolute left-3 text-[var(--text-secondary)] pointer-events-none" />
        <Input
          ref={ref}
          type="search"
          className={cn("pl-10 rounded-full", className)}
          placeholder="Search..."
          {...props}
        />
      </div>
    );
  }
);
SearchInput.displayName = "SearchInput";
