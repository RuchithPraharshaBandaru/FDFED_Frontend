import React from 'react';

const Button = ({ 
    children, 
    type = 'button', 
    variant = 'default', 
    size = 'default',
    fullWidth = false,
    disabled = false,
    onClick,
    className = '',
    ...props 
}) => {
    // 1. Base styles for all buttons (Focus states, positioning, etc.)
    const baseClasses = 'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow-sm';
    
    // 2. Variant styles mapping to your new CSS variables
    const variantClasses = {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90', // Alias for 'default' to keep your old code working
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        outline: 'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
        ghost: 'shadow-none hover:bg-accent hover:text-accent-foreground',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90', // Alias for destructive
        link: 'text-primary underline-offset-4 hover:underline shadow-none'
    };
    
    // 3. Size styles
    const sizeClasses = {
        default: 'h-9 px-4 py-2',
        md: 'h-9 px-4 py-2', // Alias for 'default'
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9 p-0'
    };
    
    const widthClass = fullWidth ? 'w-full' : '';
    
    // Handle fallback for unknown variants
    const selectedVariant = variantClasses[variant] || variantClasses.default;
    const selectedSize = sizeClasses[size] || sizeClasses.default;

    return (
        <button
            type={type}
            disabled={disabled}
            onClick={onClick}
            className={`${baseClasses} ${selectedVariant} ${selectedSize} ${widthClass} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
