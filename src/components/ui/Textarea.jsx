// src/components/ui/Textarea.jsx
import React from 'react';

const Textarea = ({ 
    label, 
    name, 
    id, 
    value, 
    onChange, 
    placeholder, 
    rows = 4,
    required = false,
    className = '',
    ...props 
}) => {
    const textareaId = id || name;
    
    return (
        <div className={className}>
            {label && (
                <label 
                    htmlFor={textareaId} 
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                    {label}
                </label>
            )}
            <textarea
                name={name}
                id={textareaId}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                rows={rows}
                required={required}
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm"
                {...props}
            />
        </div>
    );
};

export default Textarea;
