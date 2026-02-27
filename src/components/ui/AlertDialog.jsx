import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

const AlertDialog = ({
    isOpen,
    onClose,
    title,
    description,
    actionLabel = 'Confirm',
    cancelLabel = 'Cancel',
    onAction,
    variant = 'default', // default | destructive | warning | success
    loading = false
}) => {
    const getIcon = () => {
        switch (variant) {
            case 'destructive': return <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />;
            case 'warning': return <AlertTriangle className="w-12 h-12 text-yellow-500 mb-4" />;
            case 'success': return <CheckCircle className="w-12 h-12 text-green-500 mb-4" />;
            default: return <Info className="w-12 h-12 text-blue-500 mb-4" />;
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="" className="max-w-sm">
            <div className="flex flex-col items-center text-center p-4">
                {getIcon()}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-8">
                    {description}
                </p>
                <div className="flex gap-3 w-full">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        fullWidth
                        disabled={loading}
                    >
                        {cancelLabel}
                    </Button>
                    <Button
                        variant={variant === 'destructive' ? 'danger' : 'default'}
                        onClick={onAction}
                        fullWidth
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : actionLabel}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default AlertDialog;
