"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

// --------------------
// Select Root
// --------------------
type SelectProps = {
  value: string
  onValueChange: (value: string) => void
  children: React.ReactNode
  [key: string]: any
}

const Select: React.FC<SelectProps> = ({ value, onValueChange, children, ...props }) => {
  return (
    <div className="relative" {...props}>
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child as React.ReactElement<any>, {
              value,
              onValueChange,
            })
          : child
      )}
    </div>
  )
}

// --------------------
// Select Trigger
// --------------------
interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  placeholder?: string
}

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children, placeholder, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children || placeholder}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  )
)
SelectTrigger.displayName = "SelectTrigger"

// --------------------
// Select Content
// --------------------
const SelectContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "absolute z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
)
SelectContent.displayName = "SelectContent"

// --------------------
// Select Item
// --------------------
interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  onValueChange?: (value: string) => void
}

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className, children, value, onValueChange, ...props }, ref) => (
    <div
      ref={ref}
      onClick={() => onValueChange?.(value)}
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-gray-100 focus:bg-gray-100",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
)
SelectItem.displayName = "SelectItem"

// --------------------
// Select Value
// --------------------
interface SelectValueProps {
  placeholder?: string
  value?: string
}

const SelectValue: React.FC<SelectValueProps> = ({ placeholder, value }) => {
  return <>{value || placeholder}</>
}

// --------------------
// Exports
// --------------------
export { Select, SelectValue, SelectTrigger, SelectContent, SelectItem }
