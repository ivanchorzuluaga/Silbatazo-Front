import { cn } from "@/lib/utils";

export interface FilterTabItem<T extends string> {
  value: T;
  label: string;
  badge?: number;
}

interface FilterTabsProps<T extends string> {
  tabs: FilterTabItem<T>[];
  value: T;
  onValueChange: (value: T) => void;
  label?: string;
  size?: "sm" | "md";
  className?: string;
}

export function FilterTabs<T extends string>({
  tabs,
  value,
  onValueChange,
  label,
  size = "md",
  className,
}: FilterTabsProps<T>) {
  const isSmall = size === "sm";

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <p className={cn("font-medium text-muted-foreground", isSmall ? "text-[11px]" : "text-sm")}> 
          {label}
        </p>
      )}
      <div className="relative">
        {/* Sombras laterales para sugerir scroll en mobile */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-6 bg-gradient-to-r from-background via-background/70 to-transparent sm:hidden" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-6 bg-gradient-to-l from-background via-background/70 to-transparent sm:hidden" />

        <div
          role="tablist"
          aria-label={label || "Filtros"}
          className={cn(
            "flex items-center gap-1.5 rounded-2xl border border-border/70 bg-muted/30 p-1.5",
            "overflow-x-auto backdrop-blur-md shadow-ios",
            "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            "sm:flex-wrap",
            isSmall ? "-mx-2 px-2" : ""
          )}
        >
          {tabs.map((tab) => {
            const isActive = value === tab.value;

            return (
              <button
                key={tab.value}
                type="button"
                role="tab"
                aria-selected={isActive}
                tabIndex={isActive ? 0 : -1}
                onClick={() => onValueChange(tab.value)}
                className={cn(
                  "relative shrink-0 whitespace-nowrap rounded-lg font-semibold transition-all",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                  "touch-manipulation",
                  isSmall
                    ? "min-h-9 px-3 py-2 text-[11px]"
                    : "min-h-10 px-4 py-2.5 text-sm",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-[0_10px_24px_-12px_rgba(0,0,0,0.7)] ring-1 ring-primary/30"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/60"
                )}
              >
                <span className="relative z-10 flex items-center gap-2">
                  {tab.label}
                  {typeof tab.badge === "number" && (
                    <span
                      className={cn(
                        "inline-flex min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold",
                        isActive
                          ? "bg-primary-foreground/20 text-primary-foreground"
                          : "bg-background/80 text-muted-foreground"
                      )}
                    >
                      {tab.badge}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
