import React, { forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: SelectOption[]
  placeholder?: string
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, placeholder, ...props }, ref) => {
    return (
      <div>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            className={cn(
              "w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 text-sm text-gray-900 focus:ring-2 focus:ring-smart-blue-500 focus:border-transparent outline-none transition-colors",
              error && "border-red-500 focus:ring-red-500",
              className
            )}
            ref={ref}
            {...props}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
      </div>
    )
  }
)

Select.displayName = "Select"

export { Select }
