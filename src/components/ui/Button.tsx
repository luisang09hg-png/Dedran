import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "danger"
  size?: "sm" | "md" | "lg"
  isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-xl text-sm font-semibold transition-all hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-astral disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-brand-gradient text-white shadow-md hover:shadow-lg": variant === "primary",
            "bg-white/50 backdrop-blur-md border border-[var(--color-border)] text-[var(--color-foreground)] hover:bg-white": variant === "secondary",
            "hover:bg-[var(--color-stardust)] hover:text-black text-[var(--color-moonlight)]": variant === "ghost",
            "border border-[var(--color-midnight)] text-[var(--color-midnight)] hover:bg-[var(--color-stardust)]": variant === "outline",
            "bg-[var(--color-error)] text-white hover:bg-red-600": variant === "danger",
            "h-8 px-3 text-xs": size === "sm",
            "h-10 px-4 py-2": size === "md",
            "h-12 px-8 text-base": size === "lg",
          },
          className
        )}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button }
