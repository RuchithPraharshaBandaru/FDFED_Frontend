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
            container: 'border-green-500/50 text-green-600 dark:text-green-400 [&>svg]:text-green-600 dark:[&>svg]:text-green-400',
            icon: CheckCircle
        },
        error: {
            container: 'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive',
            icon: XCircle
        },
        warning: {
            container: 'border-yellow-500/50 text-yellow-600 dark:text-yellow-400 [&>svg]:text-yellow-600 dark:[&>svg]:text-yellow-400',
            icon: AlertCircle
        },
        info: {
            container: 'bg-background text-foreground border-border [&>svg]:text-foreground',
            icon: Info
        }
    };
    
    const style = styles[type] || styles.info;
    const Icon = style.icon;
    
    return (
        <div 
            role="alert"
            className={`relative w-full rounded-lg border p-4 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg+div]:translate-y-[-3px] [&:has(svg)]:pl-11 ${style.container} ${className}`}
            {...props}
        >
            <Icon className="h-4 w-4" />
            <div className="text-sm font-medium leading-relaxed">
                {message}
            </div>
        </div>
    );
};

export default Alert;
