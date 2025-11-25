// src/components/ui/Card.jsx
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
            className={`bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 ${paddingClasses[padding]} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
