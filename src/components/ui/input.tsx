import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, leftIcon, rightIcon, ...props }, ref) => {
    return (
      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3 flex items-center text-muted-foreground [&_svg]:size-4">
            {leftIcon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            "flex h-12 sm:h-11 w-full rounded-lg border border-border/80 bg-card/70 px-4 py-3 text-base sm:text-sm text-foreground shadow-ios transition-ios",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
            "placeholder:text-muted-foreground/60",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:border-primary focus-visible:shadow-ios-md",
            "disabled:cursor-not-allowed disabled:opacity-50",
            leftIcon && "pl-10",
            rightIcon && "pr-10",
            className
          )}
          ref={ref}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 flex items-center text-muted-foreground [&_svg]:size-4">
            {rightIcon}
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
