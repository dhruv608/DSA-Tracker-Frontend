"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"

import { cn } from "@/lib/utils"
import { ChevronDownIcon, CheckIcon, ChevronUpIcon } from "lucide-react"

/* ROOT */
export function Select(props: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root {...props} />
}

/* GROUP */
export function SelectGroup({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return (
    <SelectPrimitive.Group
      className={cn("p-1", className)}
      {...props}
    />
  )
}

/* VALUE */
export function SelectValue(props: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value {...props} />
}

/* TRIGGER (ENHANCED) */
export function SelectTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger>) {
  return (
    <SelectPrimitive.Trigger
      className={cn(
        `
        flex items-center justify-between gap-2

        h-10 px-4 rounded-full

        bg-accent/40
        border border-border

        text-m font-medium

        transition-all duration-200

        hover:bg-accent/60

        focus:outline-none
        focus:ring-2 focus:ring-primary/20
        focus:border-primary

        disabled:opacity-50 disabled:cursor-not-allowed

        data-placeholder:text-muted-foreground

        [&_svg]:size-4 [&_svg]:text-muted-foreground
        `,
        className
      )}
      {...props}
    >
      {children}

      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

/* CONTENT (MAIN UPGRADE) */
export function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        position={position}
        className={cn(
          `
          z-50

          min-w-[180px]

          max-h-64
          overflow-y-auto overflow-x-hidden

          rounded-2xl

          bg-[var(--glass-bg)]

          

          backdrop-blur-md

          border border-[var(--glass-border)]

          p-1.5

          shadow-lg

          scroll-smooth
          scrollbar-none

          data-[state=open]:animate-in
          data-[state=closed]:animate-out
          data-[state=open]:fade-in-0
          data-[state=open]:zoom-in-95
          data-[state=closed]:fade-out-0
          data-[state=closed]:zoom-out-95
          `,
          className
        )}
        {...props}
      >
        <SelectScrollUpButton />

        <SelectPrimitive.Viewport className="p-1">
          {children}
        </SelectPrimitive.Viewport>

        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

/* ITEM (ENHANCED) */
export function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      className={cn(
        `
        relative flex items-center gap-2

        px-3 py-2 rounded-lg
        text-white 
        text-sm font-medium
         
        cursor-pointer select-none outline-none

        transition-all duration-200
        
        text-foreground/80

        hover:text-foreground
        hover:bg-accent/60
        hover:scale-105
        hover:font-bold
        
        

        focus:bg-accent
        focus:text-foreground

        data-[disabled]:opacity-40
        data-[disabled]:pointer-events-none
        `,
        className
      )}
      {...props}
    >
      <span className="absolute right-3 flex items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="w-4 h-4" />
        </SelectPrimitive.ItemIndicator>
      </span>

      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

/* LABEL */
export function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      className={cn("px-3 py-1.5 text-xs font-semibold text-muted-foreground", className)}
      {...props}
    />
  )
}

/* SEPARATOR */
export function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      className={cn("my-1 h-px bg-border/60", className)}
      {...props}
    />
  )
}

/* SCROLL UP */
export function SelectScrollUpButton(
  props: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>
) {
  return (
    <SelectPrimitive.ScrollUpButton
      className="flex items-center justify-center py-1 text-muted-foreground"
      {...props}
    >
      <ChevronUpIcon className="w-4 h-4" />
    </SelectPrimitive.ScrollUpButton>
  )
}

/* SCROLL DOWN */
export function SelectScrollDownButton(
  props: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>
) {
  return (
    <SelectPrimitive.ScrollDownButton
      className="flex items-center justify-center py-1 text-muted-foreground"
      {...props}
    >
      <ChevronDownIcon className="w-4 h-4" />
    </SelectPrimitive.ScrollDownButton>
  )
}