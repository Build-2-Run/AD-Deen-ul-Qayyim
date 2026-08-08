"use client"
import * as React from "react"
import { Dialog, DialogPortal, DialogOverlay, DialogClose, DialogTrigger } from "./Dialog"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { Icon } from "../icons/Icon"
import { cn } from "../../utils/cn"

const Sheet = Dialog
const SheetTrigger = DialogTrigger
const SheetClose = DialogClose
const SheetPortal = DialogPortal

const SheetOverlay = DialogOverlay

export interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  side?: "top" | "bottom" | "left" | "right"
}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  SheetContentProps
>(({ side = "right", className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed z-50 gap-4 bg-[var(--surface)] p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
        {
          "inset-y-0 right-0 h-full w-3/4 border-l border-[var(--border)] sm:max-w-sm data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right": side === "right",
          "inset-y-0 left-0 h-full w-3/4 border-r border-[var(--border)] sm:max-w-sm data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left": side === "left",
          "inset-x-0 top-0 border-b border-[var(--border)] data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top": side === "top",
          "inset-x-0 bottom-0 border-t border-[var(--border)] data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom": side === "bottom",
        },
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-[var(--background)] transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-[var(--border)]">
        <Icon name="X" size={16} />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </SheetPortal>
))
SheetContent.displayName = DialogPrimitive.Content.displayName

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
}
