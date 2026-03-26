import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "w-full min-w-0 transition-all outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm hover:border-border/80",
        className
      )}
      style={{
        height: 'var(--spacing-lg)',
        borderRadius: 'var(--radius-lg)',
        border: `1px solid var(--border)`,
        backgroundColor: 'var(--input)',
        color: 'var(--foreground)',
        fontSize: 'var(--text-base)',
        padding: 'var(--spacing-sm) var(--spacing-xs)'
      }}
      {...props}
    />
  )
}

export { Input }
