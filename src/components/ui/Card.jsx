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
            className={`rounded-xl border bg-card text-card-foreground shadow ${paddingClasses[padding]} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
