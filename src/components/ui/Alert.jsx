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
            container: 'border-2 border-green-500/30 bg-green-500/10 dark:bg-green-500/20 backdrop-blur-sm text-green-700 dark:text-green-300 [&>svg]:text-green-600 dark:[&>svg]:text-green-400 shadow-lg shadow-green-500/10',
            icon: CheckCircle
        },
        error: {
            container: 'border-2 border-red-500/30 bg-red-500/10 dark:bg-red-500/20 backdrop-blur-sm text-red-700 dark:text-red-300 [&>svg]:text-red-600 dark:[&>svg]:text-red-400 shadow-lg shadow-red-500/10',
            icon: XCircle
        },
        warning: {
            container: 'border-2 border-yellow-500/30 bg-yellow-500/10 dark:bg-yellow-500/20 backdrop-blur-sm text-yellow-700 dark:text-yellow-300 [&>svg]:text-yellow-600 dark:[&>svg]:text-yellow-400 shadow-lg shadow-yellow-500/10',
            icon: AlertCircle
        },
        info: {
            container: 'border-2 border-blue-500/30 bg-blue-500/10 dark:bg-blue-500/20 backdrop-blur-sm text-blue-700 dark:text-blue-300 [&>svg]:text-blue-600 dark:[&>svg]:text-blue-400 shadow-lg shadow-blue-500/10',
            icon: Info
        }
    };
    
    const style = styles[type] || styles.info;
    const Icon = style.icon;
    
    return (
        <div 
            role="alert"
            className={`relative w-full rounded-xl border p-4 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg+div]:translate-y-[-3px] [&:has(svg)]:pl-11 ${style.container} ${className}`}
            {...props}
        >
            <Icon className="h-4 w-4" />
            <div className="text-sm font-semibold leading-relaxed">
                {message}
            </div>
        </div>
    );
};

export default Alert;
