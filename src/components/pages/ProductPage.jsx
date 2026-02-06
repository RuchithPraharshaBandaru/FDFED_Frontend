// src/components/pages/ProductPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById, apiDeleteReview } from '../../services/api.js';
import ProductCard from '../ui/ProductCard';
import { Heart, ChevronDown, Check, Trash2 } from 'lucide-react';
import { addToCartAsync } from '../../store/slices/cartSlice';
import { selectIsAuthenticated, selectUser } from '../../store/slices/authSlice';
import ReviewForm from '../ui/ReviewForm';

const ProductPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const user = useSelector(selectUser);
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [added, setAdded] = useState(false); 
    
    // --- NEW: State for selected size ---
    const [selectedSize, setSelectedSize] = useState(null);

    const loadProduct = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchProductById(id);
            setProduct(data.product);
            setRelatedProducts(data.relatedProducts);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProduct();
        window.scrollTo(0, 0);
        setAdded(false); 
        setSelectedSize(null); // Reset size when product changes
    }, [id]);

    const handleAddToCart = () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        
        // --- NEW: Validation for Size ---
        if (!selectedSize) {
            alert("Please select a size first!");
            return;
        }
        
        if (product) {
            // --- NEW: Dispatch with size ---
            dispatch(addToCartAsync({ product, size: selectedSize }));
            setAdded(true);
            setTimeout(() => setAdded(false), 2000);
        }
    };

    const handleReviewSubmitted = () => {
        loadProduct(); 
    };

    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm("Are you sure you want to delete this review?")) {
            return;
        }
        try {
            await apiDeleteReview(reviewId);
            loadProduct(); 
        } catch (err) {
            console.error("Failed to delete review:", err);
            alert(err.message); 
        }
    };

    if (loading) return <div className="text-center p-8 dark:bg-gray-900 dark:text-white">Loading...</div>;
    if (error) return <div className="text-center text-red-500 dark:text-red-400 p-8 dark:bg-gray-900">{error}</div>;
    if (!product) return null;

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-green-50/12 to-emerald-50/15 dark:from-gray-950 dark:via-green-900/22 dark:to-emerald-900/18 overflow-hidden">
            {/* Futuristic background elements */}
            <div className="absolute inset-0 bg-dot-pattern opacity-[0.02] dark:opacity-[0.06] pointer-events-none" />
            <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-gradient-to-br from-green-400/8 to-emerald-500/8 dark:from-green-500/18 dark:to-emerald-600/18 blur-3xl rounded-full" />
            <div className="absolute bottom-20 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-emerald-400/6 to-green-500/6 dark:from-emerald-600/14 dark:to-green-700/14 blur-3xl rounded-full" />
            
            <div className="relative max-w-6xl mx-auto p-6">
                <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                    <Link to="/" className="hover:underline">Home</Link> / <Link to="/store" className="hover:underline">Shop</Link> / <span className="text-gray-700 dark:text-gray-300">{product.title}</span>
                </nav>
                
                <div className="relative mb-12">
                    <div className="absolute inset-0 bg-linear-to-br from-white/60 to-white/30 dark:from-gray-800/75 dark:to-gray-900/65 backdrop-blur-xl rounded-3xl" />
                    <div className="relative bg-white/40 dark:bg-gray-800/55 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-green-500/25 shadow-2xl dark:shadow-green-500/15 p-8">
                        <div className="grid md:grid-cols-2 gap-12">
                   <div className="flex flex-col-reverse md:flex-row gap-4">
                       <div className="flex md:flex-col gap-3 justify-center">
                          {[...Array(4)].map((_, i) => (
                               <img key={i} src={product.image} className="w-16 h-16 object-cover cursor-pointer rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-500 transition-all shadow-sm" />
                          ))}
                       </div>
                           <div className="grow">
                            <img src={product.image} alt={product.title}
                               className="w-full h-full object-cover rounded-2xl shadow-lg" />
                       </div>
                   </div>
                   <div>
                       <p className="font-semibold text-gray-500 dark:text-gray-400">
                           {product.sellerId && product.sellerId.storeName ? product.sellerId.storeName : 'Brand Name'}
                       </p>
                       <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mt-1">{product.title}</h1>
                       <p className="text-3xl font-bold text-gray-800 dark:text-white mt-4">Rs.{product.price}</p>
                       
                       {/* --- NEW: Interactive Size Selector --- */}
                       <div className="mt-6">
                           <div className="flex justify-between items-center">
                               <h3 className="font-semibold text-gray-700 dark:text-gray-300">
                                   Select Size {selectedSize && <span className="text-green-600 dark:text-green-400">- {selectedSize}</span>}
                               </h3>
                               <a href="#" className="text-sm text-gray-500 hover:underline">Size Guide</a>
                           </div>
                           <div className="flex gap-2 mt-2">
                               {['XS', 'S', 'M', 'L', 'XL'].map(size => (
                                   <button 
                                       key={size} 
                                       onClick={() => setSelectedSize(size)}
                                       className={`w-12 h-12 rounded border transition-all font-medium
                                        ${selectedSize === size 
                                            ? 'bg-green-600 text-white border-green-600 shadow-md transform scale-105' 
                                            : 'border-gray-200 dark:border-gray-600 dark:text-white hover:border-gray-800 dark:hover:border-gray-400'
                                        }`}
                                   >
                                       {size}
                                   </button>
                               ))}
                           </div>
                       </div>
                       {/* --- END Size Selector --- */}

                       <div className="mt-8 flex gap-4">
                           <button
                               onClick={handleAddToCart}
                               disabled={!product.stock || added}
                               className={`flex-1 py-3.5 rounded-xl font-bold transition-all flex items-center justify-center shadow-lg
                               ${added
                                   ? 'bg-green-600 text-white shadow-green-500/30'
                                   : 'bg-linear-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-green-500/30'
                               }
                               disabled:opacity-50`}
                           >
                               {added ? (
                                   <>
                                       <Check className="mr-2" /> Added!
                                   </>
                               ) : !product.stock ? (
                                   'Out of Stock'
                               ) : (
                                   'Add to Cart'
                               )}
                           </button>
                           <button className="border-2 border-gray-200 dark:border-gray-700 p-3 rounded-xl hover:border-green-500 dark:hover:border-green-500 transition-all shadow-sm"><Heart /></button>
                       </div>
                       <div className="mt-8 border-t dark:border-gray-700">
                           <div className="py-4 border-b dark:border-gray-700">
                               <h4 className="flex justify-between items-center cursor-pointer font-semibold dark:text-white">Description <ChevronDown/></h4>
                               <p className="text-gray-600 dark:text-gray-300 mt-2">{product.description}</p>
                           </div>
                            <div className="py-4 border-b dark:border-gray-700">
                               <h4 className="flex justify-between items-center cursor-pointer font-semibold dark:text-white">Materials & Care <ChevronDown/></h4>
                           </div>
                       </div>
                   </div>
                        </div>
                    </div>
                </div>

                <div className="mt-16">
                    <h3 className="text-2xl font-bold mb-6 dark:text-white">Reviews</h3>
                    
                    {product.reviews && product.reviews.length > 0 ? (
                        <div className="space-y-4 mb-6">
                            {product.reviews.map(review => (
                                <div key={review._id} className="p-4 border dark:border-gray-700 dark:bg-gray-800 rounded-md">
                                    <div className="flex justify-between items-center mb-1">
                                        <div className="flex items-center">
                                            <span className="font-semibold dark:text-white">{review.user ? review.user.firstname : 'User'}</span>
                                            <span className="text-yellow-400 ml-2">
                                                {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                                            </span>
                                        </div>
                                        
                                        {isAuthenticated && review.user && user && review.user._id === user._id && (
                                            <button
                                                onClick={() => handleDeleteReview(review._id)}
                                                className="p-1 text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900 rounded-full"
                                                title="Delete review"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-gray-700 dark:text-gray-300">{review.description}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400 mb-6">No reviews yet.</p>
                    )}

                    {isAuthenticated ? (
                        <ReviewForm 
                            productId={id} 
                            onReviewSubmitted={handleReviewSubmitted} 
                        />
                    ) : (
                        <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-md border dark:border-gray-700">
                            <p className="dark:text-gray-300">You must be <Link to="/login" className="text-green-500 font-medium hover:underline">logged in</Link> to leave a review.</p>
                        </div>
                    )}
                </div>

                <div className="mt-16">
                    <h3 className="text-2xl font-bold mb-6 dark:text-white">You Might Also Like</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {relatedProducts && relatedProducts.length > 0 ? (
                            relatedProducts.map(p => <ProductCard key={p._id} {...p} />)
                        ) : (
                            <p className="col-span-full text-gray-500 dark:text-gray-400">No related items found.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;