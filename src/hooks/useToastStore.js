import { useState, useCallback, useContext, createContext } from 'react';

// Create Toast Context
export const ToastContext = createContext();

// Custom hook for using toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

// Toast Provider Component (to be wrapped around app)
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  let toastId = 0;

  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = toastId++;
    setToasts(prev => [...prev, { id, message, type, duration }]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  const value = {
    toasts,
    addToast,
    removeToast,
    clearAll,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
};

// Convenience functions for calling toast
export const toast = {
  success: (message, duration) => {
    // Note: This will be called from components that use useToast hook
    return { message, type: 'success', duration };
  },
  error: (message, duration) => {
    return { message, type: 'error', duration };
  },
  warning: (message, duration) => {
    return { message, type: 'warning', duration };
  },
  info: (message, duration) => {
    return { message, type: 'info', duration };
  },
};

export default useToast;
