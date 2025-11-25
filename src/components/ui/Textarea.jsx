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
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
                className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                {...props}
            />
        </div>
    );
};

export default Textarea;
