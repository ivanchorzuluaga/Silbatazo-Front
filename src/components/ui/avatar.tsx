import * as React from "react"
import { cn } from "@/lib/utils"

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  fallback?: string
  size?: "sm" | "default" | "lg" | "xl"
}

const sizeClasses = {
  sm: "size-8 text-xs",
  default: "size-10 text-sm",
  lg: "size-12 text-base",
  xl: "size-16 text-xl",
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallback, size = "default", ...props }, ref) => {
    const [imgError, setImgError] = React.useState(false)
    const showFallback = !src || imgError

    const getInitials = (name?: string) => {
      if (!name) return "?"
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    }

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex shrink-0 overflow-hidden rounded-full bg-primary/20 text-primary font-semibold",
          "flex items-center justify-center",
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {showFallback ? (
          <span className="select-none">
            {fallback || getInitials(alt || "?")}
          </span>
        ) : (
          <img
            src={src}
            alt={alt}
            className="h-full w-full object-cover"
            onError={() => setImgError(true)}
          />
        )}
      </div>
    )
  }
)
Avatar.displayName = "Avatar"

export { Avatar }

