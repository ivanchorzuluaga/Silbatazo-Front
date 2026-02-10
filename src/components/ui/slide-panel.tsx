import * as React from "react";
import { cn } from "@/lib/utils";

interface SlidePanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

interface SlidePanelContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const SlidePanel = ({ open, onOpenChange, children }: SlidePanelProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50" onClick={() => onOpenChange(false)}>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 dark:bg-black/70 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
      />
      {/* Panel centrado: flex para centrar el contenido y padding horizontal en móvil */}
      <div
        className="fixed top-0 left-0 right-0 z-50 safe-area-top flex justify-center px-4 sm:px-6"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

const SlidePanelContent = React.forwardRef<HTMLDivElement, SlidePanelContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "w-full nav-surface border-b shadow-ios-xl slide-panel-enter",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
SlidePanelContent.displayName = "SlidePanelContent";

const SlidePanelHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 p-6 pb-5 border-b border-border/50", className)}
      {...props}
    />
  );
};

const SlidePanelTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => {
  return (
    <h2
      ref={ref}
      className={cn("text-xl font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  );
});
SlidePanelTitle.displayName = "SlidePanelTitle";

const SlidePanelDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  return <p ref={ref} className={cn("text-sm text-muted-foreground mt-1", className)} {...props} />;
});
SlidePanelDescription.displayName = "SlidePanelDescription";

export { SlidePanel, SlidePanelContent, SlidePanelHeader, SlidePanelTitle, SlidePanelDescription };
