// src/components/ui/Input.jsx
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
        <div className={className}>
            {label && (
                <label 
                    htmlFor={inputId} 
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
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
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm"
                {...props}
            />
        </div>
    );
};

export default Input;
