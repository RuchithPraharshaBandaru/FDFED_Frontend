import React from 'react';

const Badge = ({ 
    children, 
    variant = 'default', 
    className = '', 
    ...props 
}) => {
    const baseClasses = "inline-flex items-center rounded-full px-3 py-1 text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-green-500/50 shadow-sm";
    
    const variants = {
        default: "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40",
        secondary: "border-2 border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-700 dark:text-gray-300 hover:border-green-500/30",
        destructive: "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40",
        outline: "border-2 border-green-500/50 text-green-600 dark:text-green-400 bg-green-500/10 dark:bg-green-500/20 backdrop-blur-sm hover:bg-green-500/20",
    };

    const variantClass = variants[variant] || variants.default;

    return (
        <div className={`${baseClasses} ${variantClass} ${className}`} {...props}>
            {children}
        </div>
    );
};

export default Badge;
export { Badge };
