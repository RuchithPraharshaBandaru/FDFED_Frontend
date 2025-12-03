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
                    className="text-sm font-semibold bg-linear-to-r from-gray-700 to-gray-900 dark:from-gray-200 dark:to-white bg-clip-text text-transparent"
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
                className="flex h-11 w-full rounded-xl border-2 border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm px-4 py-2 text-sm font-medium shadow-sm transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 hover:border-green-500/30 disabled:cursor-not-allowed disabled:opacity-50"
                {...props}
            />
        </div>
    );
};

export default Input;
export { Input };
