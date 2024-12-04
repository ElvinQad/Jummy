import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cn } from "../../lib/utils"
import { X } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"

const ToastProvider = ToastPrimitives.Provider

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-4 pr-6 shadow-lg transition-all data-[swipe=move]:transition-none",
  {
    variants: {
      variant: {
        default: "bg-gray-800 border-gray-700 text-gray-100",
        destructive: "bg-red-600 border-red-600 text-white",
        success: "bg-green-600 border-green-600 text-white",
        list: "bg-blue-600 border-blue-600 text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface ToastProps extends React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root>,
  VariantProps<typeof toastVariants> {}

type ToastViewportProps = React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport> & {
  className?: string;
}

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  ToastViewportProps
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse gap-2 p-4 sm:max-w-[420px]",
      className
    )}
    {...props} />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const baseToastClasses = "text-sm transition-opacity"

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  ToastProps
>(({ className, variant, ...props }, ref) => (
  <ToastPrimitives.Root
    ref={ref}
    className={cn(toastVariants({ variant }), 
      "data-[swipe=move]:transition-none",
      "data-[state=open]:animate-in",
      "data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-80",
      "data-[state=closed]:slide-out-to-right-full",
      "data-[state=open]:slide-in-from-top-full",
      className
    )}
    {...props}
  />
))
Toast.displayName = ToastPrimitives.Root.displayName

type ToastActionProps = React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action> & {
  className?: string;
}

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  ToastActionProps
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border border-border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-foodred-100/40 group-[.destructive]:hover:border-foodred-500/30 group-[.destructive]:hover:bg-foodred-600 group-[.destructive]:hover:text-white group-[.destructive]:focus:ring-foodred-500",
      className
    )}
    {...props} />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

type ToastCloseProps = React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close> & {
  className?: string;
}

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  ToastCloseProps
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-1 top-1 rounded-md p-1 text-gray-400 opacity-100 transition-opacity hover:text-gray-50 focus:opacity-100 focus:outline-none focus:ring-1 focus:ring-gray-700",
      className
    )}
    toast-close=""
    {...props}>
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

type ToastTitleProps = React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title> & {
  className?: string;
}

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  ToastTitleProps
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title 
    ref={ref} 
    className={cn("text-sm font-semibold leading-none tracking-tight", className)} 
    {...props} 
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

type ToastDescriptionProps = React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description> & {
  className?: string;
}

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  ToastDescriptionProps
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description 
    ref={ref} 
    className={cn("text-sm opacity-90 mt-1", className)} 
    {...props} 
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

export type { ToastProps, ToastActionProps }
export { ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription, ToastClose, ToastAction }
