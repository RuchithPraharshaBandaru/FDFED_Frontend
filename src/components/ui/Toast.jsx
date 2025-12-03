import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const Toast = ({ id, message, type = 'info', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose(id), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const typeStyles = {
    success: 'bg-green-50 text-green-900 border-green-200 dark:bg-green-950 dark:text-green-50 dark:border-green-800',
    error: 'bg-red-50 text-red-900 border-red-200 dark:bg-red-950 dark:text-red-50 dark:border-red-800',
    warning: 'bg-yellow-50 text-yellow-900 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-50 dark:border-yellow-800',
    info: 'bg-blue-50 text-blue-900 border-blue-200 dark:bg-blue-950 dark:text-blue-50 dark:border-blue-800'
  };

  const typeIcons = {
    success: <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />,
    error: <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />,
    warning: <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />,
    info: <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
  };

  return (
    <div
      className={`
        fixed bottom-4 right-4 max-w-sm rounded-lg border shadow-lg
        transition-all duration-300 ease-out pointer-events-auto
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
        ${typeStyles[type]}
        flex items-center gap-3 p-4
        z-50
      `}
    >
      {typeIcons[type]}
      <div className="flex-1 text-sm font-medium">{message}</div>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(() => onClose(id), 300);
        }}
        className="flex-shrink-0 text-current opacity-60 hover:opacity-100 transition-opacity"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default Toast;
