import { cn } from '@/lib/utils';
import React, { forwardRef } from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  loadingText?: string;
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    isLoading = false,
    loadingText = 'Loading...',
    asChild = false,
    children, 
    disabled,
    ...props 
  }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    
        const variants = {
          primary: "text-white shadow-sm hover:opacity-90",
          secondary: "bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-500",
          outline: "border-2 bg-white hover:bg-opacity-10 focus:ring-smart-blue-500 shadow-sm",
          ghost: "text-gray-700 hover:bg-gray-100 focus:ring-smart-blue-500"
        };
    
    const sizes = {
      sm: "px-3 py-2 text-sm",
      md: "px-4 py-3 text-sm",
      lg: "px-6 py-4 text-base"
    };

    if (asChild) {
      return (
        <span
          className={cn(
            baseStyles,
            variants[variant],
            sizes[size],
            className
          )}
        >
          {children}
        </span>
      );
    }

    const getButtonStyle = () => {
      const baseStyle = {};
      if (variant === 'primary') {
        return {
          backgroundColor: '#0F96E3',
          ...baseStyle
        };
      } else if (variant === 'outline') {
        return {
          borderColor: '#0F96E3',
          color: '#0F96E3',
          ...baseStyle
        };
      }
      return baseStyle;
    };

    const getHoverStyle = () => {
      if (variant === 'primary') {
        return {
          '--hover-bg': '#0C7BC2'
        } as React.CSSProperties;
      } else if (variant === 'outline') {
        return {
          '--hover-bg': '#E6F4FF'
        } as React.CSSProperties;
      }
      return {};
    };

    return (
      <button
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        style={{...getButtonStyle(), ...getHoverStyle()}}
        disabled={disabled || isLoading}
        ref={ref}
        {...props}
      >
        {isLoading ? (
          <>
            <svg 
              className="animate-spin -ml-1 mr-3 h-5 w-5" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {loadingText}
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
