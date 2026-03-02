// src/components/pages/SellerEditProductPage.jsx
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { updateProduct } from '../../store/slices/sellerSlice';
import { apiGetProduct, apiUpdateProduct } from '../../services/sellerApi';
import { useToast } from '../../context/ToastContext';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { Card } from '../ui/Card';
import { EditProductPageShimmer } from '../ui/Shimmer';

const categories = [
    'Cotton',
    'Silk',
    'Leather',
    'Cashmere',
    'Synthetic',
    'Denim',
    'Polyester'
];

export const SellerEditProductPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { products } = useSelector((state) => state.seller);
    const { showSuccess, showError } = useToast();

    const [formData, setFormData] = useState({
        title: '',
        price: '',
        description: '',
        category: '',
        quantity: '',
        stock: true,
    });

    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setFetchLoading(true);
                
                // First try to find product in Redux store
                const existingProduct = products.find(p => p._id === id);
                if (existingProduct) {
                    setFormData({
                        title: existingProduct.title || '',
                        price: existingProduct.price || '',
                        description: existingProduct.description || '',
                        category: existingProduct.category || '',
                        quantity: existingProduct.quantity || '',
                        stock: existingProduct.stock !== undefined ? existingProduct.stock : true,
                    });
                    setFetchLoading(false);
                    return;
                }

                // If not in store, fetch from API
                const result = await apiGetProduct(id);
                const product = result.product;
                
                setFormData({
                    title: product.title || '',
                    price: product.price || '',
                    description: product.description || '',
                    category: product.category || '',
                    quantity: product.quantity || '',
                    stock: product.stock !== undefined ? product.stock : true,
                });
            } catch (error) {
                setError(`Failed to fetch product: ${error.message}`);
            } finally {
                setFetchLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id, products]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        
        // Validation
        if (!formData.title || !formData.price || !formData.description || 
            !formData.category || formData.quantity === '') {
            const errorMsg = 'Please fill in all fields';
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
            const updateData = {
                title: formData.title,
                price: parseFloat(formData.price),
                description: formData.description,
                category: formData.category,
                quantity: parseInt(formData.quantity),
                stock: formData.stock,
            };

            const result = await apiUpdateProduct(id, updateData);
            
            if (result.success) {
                // Update product in Redux store
                dispatch(updateProduct({ _id: id, ...updateData }));
                showSuccess('Product updated successfully!');
                navigate('/seller/products');
            }
        } catch (error) {
            const errorMsg = error.message || 'Failed to update product';
            setError(errorMsg);
            showError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    if (fetchLoading) {
        return <EditProductPageShimmer />;
    }

    return (
        <div className="min-h-screen bg-background py-8">
            <div className="container max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">Edit Product</h1>
                    <p className="text-muted-foreground mt-2">
                        Update your product information
                    </p>
                </div>

                <Card className="p-8">
                    {error && (
                        <Alert variant="destructive" className="mb-6">
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
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

                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700/50 rounded-md p-4">
                            <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                Note: To update the product image, you'll need to create a new product. 
                                Image updates are not supported through the edit function.
                            </p>
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
                                {loading ? 'Updating...' : 'Update Product'}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};