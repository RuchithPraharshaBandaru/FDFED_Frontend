// src/components/pages/SellerCreateProductPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCreateProduct } from '../../services/sellerApi';
import { useToast } from '../../context/ToastContext';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { Card } from '../ui/Card';

const categories = [
    'Cotton',
    'Silk',
    'Leather',
    'Cashmere',
    'Synthetic',
    'Denim',
    'Polyester'
];

export const SellerCreateProductPage = () => {
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        description: '',
        category: '',
        quantity: '',
        stock: true,
    });

    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [preview, setPreview] = useState(null);

    const navigate = useNavigate();
    const { showSuccess, showError } = useToast();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        
        // Validation
        if (!formData.title || !formData.price || !formData.description || 
            !formData.category || !formData.quantity || !image) {
            const errorMsg = 'Please fill in all fields and upload an image';
            setError(errorMsg);
            showError(errorMsg);
            return;
        }

        if (parseFloat(formData.price) <= 0) {
            const errorMsg = 'Price must be greater than 0';
            setError(errorMsg);
            showError(errorMsg);
            return;
        }

        if (parseInt(formData.quantity) < 0) {
            const errorMsg = 'Quantity cannot be negative';
            setError(errorMsg);
            showError(errorMsg);
            return;
        }

        setLoading(true);

        try {
            // Create FormData
            const productData = new FormData();
            productData.append('title', formData.title);
            productData.append('price', parseFloat(formData.price));
            productData.append('description', formData.description);
            productData.append('category', formData.category);
            productData.append('quantity', parseInt(formData.quantity));
            productData.append('stock', formData.stock);
            productData.append('img', image);

            const result = await apiCreateProduct(productData);
            
            if (result.success) {
                showSuccess('Product created successfully!');
                // Add product to Redux store (we might need to fetch the created product)
                // For now, we'll just navigate back and let the products page refresh
                navigate('/seller/products');
            }
        } catch (error) {
            const errorMsg = error.message || 'Failed to create product';
            setError(errorMsg);
            showError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background py-8">
            <div className="container max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">Add New Product</h1>
                    <p className="text-muted-foreground mt-2">
                        Create a new product listing for your store
                    </p>
                </div>

                <Card className="p-8">
                    {error && (
                        <Alert variant="destructive" className="mb-6">
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Product Image */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Product Image *
                            </label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                <div className="space-y-1 text-center">
                                    {preview ? (
                                        <div className="mb-4">
                                            <img
                                                src={preview}
                                                alt="Preview"
                                                className="mx-auto h-32 w-32 object-cover rounded-lg"
                                            />
                                        </div>
                                    ) : (
                                        <svg
                                            className="mx-auto h-12 w-12 text-gray-400"
                                            stroke="currentColor"
                                            fill="none"
                                            viewBox="0 0 48 48"
                                        >
                                            <path
                                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    )}
                                    <div className="flex text-sm text-gray-600">
                                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                            <span>Upload a file</span>
                                            <input
                                                type="file"
                                                className="sr-only"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                required
                                            />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                </div>
                            </div>
                        </div>

                        {/* Product Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Product Title *"
                                name="title"
                                type="text"
                                required
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Enter product title"
                            />

                            <Input
                                label="Price (₹) *"
                                name="price"
                                type="number"
                                step="0.01"
                                min="0"
                                required
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="0.00"
                            />

                            <Select
                                label="Category *"
                                name="category"
                                required
                                value={formData.category}
                                onChange={handleChange}
                                options={categories.map(cat => ({ value: cat, label: cat }))}
                                placeholder="Select a category"
                            />

                            <Input
                                label="Quantity *"
                                name="quantity"
                                type="number"
                                min="0"
                                required
                                value={formData.quantity}
                                onChange={handleChange}
                                placeholder="0"
                            />
                        </div>

                        <Textarea
                            label="Description *"
                            name="description"
                            required
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe your product..."
                            rows={4}
                        />

                        <div className="flex items-center">
                            <input
                                id="stock"
                                name="stock"
                                type="checkbox"
                                checked={formData.stock}
                                onChange={handleChange}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <label htmlFor="stock" className="ml-2 block text-sm text-foreground">
                                Product is in stock
                            </label>
                        </div>

                        <div className="flex space-x-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate('/seller/products')}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={loading}
                                className="flex-1"
                            >
                                {loading ? 'Creating...' : 'Create Product'}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};