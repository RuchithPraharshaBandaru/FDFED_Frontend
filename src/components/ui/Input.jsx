import React from 'react';

const Input = ({ 
    label, 
    type = 'text', 
    name, 
    id, 
    value, 
    onChange, 
    placeholder, 
    required = false,
    className = '',
    ...props 
}) => {
    const inputId = id || name;
    
    return (
        <div className={`space-y-2 ${className}`}>
            {label && (
                <label 
                    htmlFor={inputId} 
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    {label}
                </label>
            )}
            <input
                type={type}
                name={name}
                id={inputId}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                {...props}
            />
        </div>
    );
};

export default Input;
