// src/components/ui/ToastContainer.jsx
import React from 'react';
import { Toast } from './Toast';

const ToastContainer = ({ toasts, onClose }) => {
    if (toasts.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    id={toast.id}
                    message={toast.message}
                    type={toast.type}
                    duration={toast.duration}
                    onClose={onClose}
                />
            ))}
        </div>
    );
};

export default ToastContainer;
export { ToastContainer };
