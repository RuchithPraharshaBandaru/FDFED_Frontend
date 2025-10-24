import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ _id, image, title, category, price }) => {
    return (
        <Link to={`/product/${_id}`} className="group block h-full">
            {/* - Removed 'border'
              - Added 'shadow-sm' for a very subtle default shadow to create distinction.
              - Kept 'hover:shadow-xl' to make it pop on hover.
            */}
            <div className="bg-white rounded-lg shadow-sm hover:shadow-xl transition-shadow overflow-hidden flex flex-col h-full">
                <div className="relative h-64 overflow-hidden">
                    <img src={image} alt={title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                    
                </div>
                <div className="p-4 flex-grow flex flex-col">
                    <div>
                        <p className="text-sm text-gray-500">{category}</p>
                        <h3 className="font-semibold text-gray-800 tracking-tight mt-1">{title}</h3>
                        <div className="flex items-center my-2 text-yellow-400">
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="far fa-star text-gray-300"></i>
                        </div>
                    </div>
                    <div className="mt-auto pt-4">
                        <span className="text-xl font-bold text-gray-900">Rs.{price}</span>
                        <button className="w-full mt-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors font-semibold">
                            View Details
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;