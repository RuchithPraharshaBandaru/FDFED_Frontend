// src/components/ui/Button.jsx
import React from 'react';

const Button = ({ 
    children, 
    type = 'button', 
    variant = 'primary', 
    size = 'md',
    fullWidth = false,
    disabled = false,
    onClick,
    className = '',
    ...props 
}) => {
    const baseClasses = 'rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2';
    
    const variantClasses = {
        primary: 'bg-green-500 text-white hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed',
        secondary: 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600',
        outline: 'border-2 border-green-500 text-green-500 hover:bg-green-50 dark:hover:bg-gray-800',
        ghost: 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
        danger: 'bg-red-500 text-white hover:bg-red-600 disabled:opacity-50'
    };
    
    const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-5 py-2 text-sm',
        lg: 'px-6 py-3 text-base'
    };
    
    const widthClass = fullWidth ? 'w-full' : '';
    
    return (
        <button
            type={type}
            disabled={disabled}
            onClick={onClick}
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
