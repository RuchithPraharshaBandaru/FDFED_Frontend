import React from 'react';

const Card = ({ 
    children, 
    className = '',
    padding = 'default',
    ...props 
}) => {
    const paddingClasses = {
        none: '',
        sm: 'p-4',
        default: 'p-6',
        lg: 'p-8'
    };
    
    return (
        <div 
            className={`rounded-2xl border-2 border-gray-200/50 dark:border-gray-700/50 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl text-card-foreground shadow-xl ${paddingClasses[padding]} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
