// Custom hook for managing form state
import { useState } from 'react';

export const useFormState = (initialState = {}) => {
    const [formData, setFormData] = useState(initialState);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const resetForm = () => {
        setFormData(initialState);
    };

    const setFormField = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return {
        formData,
        setFormData,
        handleChange,
        resetForm,
        setFormField
    };
};

export default useFormState;
