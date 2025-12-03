// src/components/ui/Toast.jsx
import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const Toast = ({ 
    id,
    message, 
    type = 'info', 
    duration = 3000,
    onClose,
    className = '',
}) => {
    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                onClose(id);
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, id, onClose]);

    const styles = {
        success: {
            container: 'border-green-500/50 bg-green-500/10 dark:bg-green-500/20 text-green-700 dark:text-green-300',
            icon: CheckCircle,
            iconColor: 'text-green-600 dark:text-green-400'
        },
        error: {
            container: 'border-red-500/50 bg-red-500/10 dark:bg-red-500/20 text-red-700 dark:text-red-300',
            icon: AlertCircle,
            iconColor: 'text-red-600 dark:text-red-400'
        },
        warning: {
            container: 'border-yellow-500/50 bg-yellow-500/10 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-300',
            icon: AlertTriangle,
            iconColor: 'text-yellow-600 dark:text-yellow-400'
        },
        info: {
            container: 'border-blue-500/50 bg-blue-500/10 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300',
            icon: Info,
            iconColor: 'text-blue-600 dark:text-blue-400'
        }
    };

    const style = styles[type] || styles.info;
    const Icon = style.icon;

    return (
        <div 
            className={`flex items-center gap-3 min-w-[300px] max-w-md p-4 rounded-xl border-2 backdrop-blur-sm shadow-lg animate-in slide-in-from-top-5 ${style.container} ${className}`}
        >
            <Icon className={`h-5 w-5 flex-shrink-0 ${style.iconColor}`} />
            <p className="flex-1 text-sm font-medium">{message}</p>
            <button
                onClick={() => onClose(id)}
                className="flex-shrink-0 p-1 rounded-md hover:bg-white/20 transition-colors"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );
};

export default Toast;
export { Toast };
