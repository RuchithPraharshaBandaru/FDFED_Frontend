import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProductById } from '../../services/api.js';
import ProductCard from '../ui/ProductCard';
import { Heart, ChevronDown, Check } from 'lucide-react'; // Added Check icon
import { useCart } from '../../context/CartContext';

const ProductPage = () => {
    const { id } = useParams();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [added, setAdded] = useState(false); // State for visual feedback

    useEffect(() => {
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
        loadProduct();
        window.scrollTo(0, 0);
        setAdded(false); // Reset feedback when product changes
    }, [id]);

    const handleAddToCart = () => {
        if (product) {
            addToCart(product);
            setAdded(true);
            setTimeout(() => setAdded(false), 2000); // Reset button text after 2 seconds
        }
    };

    if (loading) return <div className="text-center p-8">Loading...</div>;
    if (error) return <div className="text-center text-red-500 p-8">{error}</div>;
    if (!product) return null;

    return (
        <div className="bg-white">
            <div className="max-w-6xl mx-auto p-6">
                <nav className="text-sm text-gray-500 mb-6">
                    <Link to="/" className="hover:underline">Home</Link> / <Link to="/store" className="hover:underline">Shop</Link> / <span className="text-gray-700">{product.title}</span>
                </nav>
                <div className="grid md:grid-cols-2 gap-12">
                    <div className="flex flex-col-reverse md:flex-row gap-4">
                        <div className="flex md:flex-col gap-3 justify-center">
                           {[...Array(4)].map((_, i) => (
                                <img key={i} src={product.image} className="w-16 h-16 object-cover cursor-pointer rounded-md border-2 hover:border-green-500" />
                           ))}
                        </div>
                        <div className="flex-grow">
                             <img src={product.image} alt={product.title}
                                className="w-full h-full object-cover rounded-lg" />
                        </div>
                    </div>
                    <div>
                        <p className="font-semibold text-gray-500">Brand Name</p>
                        <h1 className="text-4xl font-extrabold text-gray-900 mt-1">{product.title}</h1>
                        <p className="text-3xl font-bold text-gray-800 mt-4">Rs.{product.price}</p>
                        <div className="mt-6">
                            <div className="flex justify-between items-center">
                                <h3 className="font-semibold text-gray-700">Select Size</h3>
                                <a href="#" className="text-sm text-gray-500 hover:underline">Size Guide</a>
                            </div>
                            <div className="flex gap-2 mt-2">
                                {['XS', 'S', 'M', 'L', 'XL'].map(size => (
                                    <button key={size} className="w-12 h-12 rounded border hover:border-gray-800 transition">{size}</button>
                                ))}
                            </div>
                        </div>
                        <div className="mt-8 flex gap-4">
                            <button
                                onClick={handleAddToCart}
                                disabled={!product.stock || added}
                                className={`flex-1 py-3 rounded-lg font-semibold transition flex items-center justify-center
                                ${added
                                    ? 'bg-green-700 text-white'
                                    : 'bg-green-600 text-white hover:bg-green-700'
                                }
                                disabled:opacity-50`}
                            >
                                {added ? <><Check className="mr-2"/> Added!</> : 'Add to Cart'}
                            </button>
                            <button className="border p-3 rounded-lg hover:border-gray-800"><Heart /></button>
                        </div>
                        <div className="mt-8 border-t">
                            <div className="py-4 border-b">
                                <h4 className="flex justify-between items-center cursor-pointer font-semibold">Description <ChevronDown/></h4>
                                <p className="text-gray-600 mt-2">{product.description}</p>
                            </div>
                             <div className="py-4 border-b">
                                <h4 className="flex justify-between items-center cursor-pointer font-semibold">Materials & Care <ChevronDown/></h4>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-16 py-12 bg-green-50/50 rounded-lg">
                     <h3 className="text-2xl font-bold text-center mb-8">Your Positive Impact</h3>
                     <div className="grid grid-cols-3 gap-8 text-center max-w-3xl mx-auto">
                        <div><p className="text-3xl font-bold">713 gal</p><span className="text-gray-600">of water saved</span></div>
                        <div><p className="text-3xl font-bold">18 lbs</p><span className="text-gray-600">of CO₂ prevented</span></div>
                        <div><p className="text-3xl font-bold">5.2 lbs</p><span className="text-gray-600">of textile waste diverted</span></div>
                     </div>
                </div>
                <div className="mt-16">
                    <h3 className="text-2xl font-bold mb-6">You Might Also Like</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {relatedProducts.length > 0 ? (
                            relatedProducts.map(p => <ProductCard key={p._id} {...p} />)
                        ) : (
                            <p className="col-span-full text-gray-500">No related items found.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;