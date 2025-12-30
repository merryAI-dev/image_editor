import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500/50 disabled:pointer-events-none disabled:opacity-50 rounded-xl',
  {
    variants: {
      variant: {
        default: 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-300 hover:to-yellow-400 shadow-lg shadow-yellow-500/25',
        secondary: 'bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20',
        outline: 'border border-white/20 bg-white/5 backdrop-blur-md text-white hover:bg-white/10',
        ghost: 'text-white/70 hover:bg-white/10 hover:text-white',
        destructive: 'bg-red-500/80 backdrop-blur-md text-white hover:bg-red-500 border border-red-400/30',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-12 px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
