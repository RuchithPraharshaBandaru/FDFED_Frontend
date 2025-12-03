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
    const baseClasses = 'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500/50 disabled:pointer-events-none disabled:opacity-50';
    
    // 2. Variant styles mapping to your new CSS variables
    const variantClasses = {
        default: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40',
        primary: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40', // Alias for 'default' to keep your old code working
        secondary: 'bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-2 border-gray-200/50 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 hover:border-green-500/30 shadow-sm',
        outline: 'border-2 border-gray-200/50 dark:border-gray-700/50 bg-transparent backdrop-blur-sm hover:bg-white/50 dark:hover:bg-gray-800/50 hover:border-green-500/30 shadow-sm',
        ghost: 'hover:bg-white/50 dark:hover:bg-gray-800/50 backdrop-blur-sm hover:text-green-600 dark:hover:text-green-400',
        destructive: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/30',
        danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/30', // Alias for destructive
        link: 'text-green-600 dark:text-green-400 underline-offset-4 hover:underline'
    };
    
    // 3. Size styles
    const sizeClasses = {
        default: 'h-10 px-5 py-2',
        md: 'h-10 px-5 py-2', // Alias for 'default'
        sm: 'h-8 rounded-lg px-3 text-xs',
        lg: 'h-12 rounded-xl px-8 text-base',
        icon: 'h-10 w-10 p-0'
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
export { Button };
