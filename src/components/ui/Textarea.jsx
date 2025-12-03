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
        <div className={`space-y-2 ${className}`}>
            {label && (
                <label 
                    htmlFor={textareaId} 
                    className="text-sm font-semibold bg-linear-to-r from-gray-700 to-gray-900 dark:from-gray-200 dark:to-white bg-clip-text text-transparent"
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
                className="flex min-h-20 w-full rounded-xl border-2 border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm px-4 py-3 text-sm font-medium shadow-sm transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 hover:border-green-500/30 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                {...props}
            />
        </div>
    );
};

export default Textarea;
