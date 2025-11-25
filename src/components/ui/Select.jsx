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
        <div className={`space-y-2 ${className}`}>
            {label && (
                <label 
                    htmlFor={selectId} 
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
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
