// src/components/ui/Alert.jsx
import React from 'react';
import { CheckCircle, AlertCircle, Info, XCircle } from 'lucide-react';

const Alert = ({ 
    type = 'info', 
    message, 
    className = '',
    ...props 
}) => {
    if (!message) return null;
    
    const styles = {
        success: {
            bg: 'bg-green-100 dark:bg-green-900',
            text: 'text-green-700 dark:text-green-300',
            border: 'border-green-200 dark:border-green-800',
            icon: CheckCircle
        },
        error: {
            bg: 'bg-red-100 dark:bg-red-900',
            text: 'text-red-700 dark:text-red-300',
            border: 'border-red-200 dark:border-red-800',
            icon: XCircle
        },
        warning: {
            bg: 'bg-yellow-100 dark:bg-yellow-900',
            text: 'text-yellow-700 dark:text-yellow-300',
            border: 'border-yellow-200 dark:border-yellow-800',
            icon: AlertCircle
        },
        info: {
            bg: 'bg-blue-100 dark:bg-blue-900',
            text: 'text-blue-700 dark:text-blue-300',
            border: 'border-blue-200 dark:border-blue-800',
            icon: Info
        }
    };
    
    const style = styles[type];
    const Icon = style.icon;
    
    return (
        <div 
            className={`flex items-center gap-3 p-4 rounded-md border ${style.bg} ${style.text} ${style.border} ${className}`}
            {...props}
        >
            <Icon className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm">{message}</p>
        </div>
    );
};

export default Alert;
