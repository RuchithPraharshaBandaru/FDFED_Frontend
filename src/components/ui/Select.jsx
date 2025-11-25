// src/components/ui/Select.jsx
import React from 'react';

const Select = ({ 
    label, 
    name, 
    id, 
    value, 
    onChange, 
    options = [], 
    placeholder = 'Select an option',
    required = false,
    className = '',
    ...props 
}) => {
    const selectId = id || name;
    
    return (
        <div className={className}>
            {label && (
                <label 
                    htmlFor={selectId} 
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                    {label}
                </label>
            )}
            <select
                name={name}
                id={selectId}
                value={value}
                onChange={onChange}
                required={required}
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm"
                {...props}
            >
                <option value="">{placeholder}</option>
                {options.map((option, index) => (
                    <option key={index} value={option.value || option}>
                        {option.label || option}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Select;
