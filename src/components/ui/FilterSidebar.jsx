import React from 'react';

const FilterSidebar = ({ filters, onFilterChange }) => {

    const handleCategoryChange = (e) => {
        // This logic remains for single-select radio for now
        onFilterChange('category', e.target.value);
    };

    const handlePriceChange = (e) => {
        const [min, max] = e.target.value.split('-');
        onFilterChange('price', {
            minPrice: min || null,
            maxPrice: max || null
        });
    };

    const categories = ['silk', 'fabric', 'cotton', 'wool', 'linen', 'cashmere'];
    const priceRanges = [
        { label: 'Under Rs. 500', value: '0-500' },
        { label: 'Rs. 500 to Rs. 1000', value: '500-1000' },
        { label: 'Over Rs. 1000', value: '1000-' }
    ];

    const sizes = ['XS', 'S', 'M', 'L', 'XL'];
    const conditions = ['New w/ Tags', 'Like New', 'Gently Used'];

    return (
        <aside className="w-72 pr-8">
            <div className="flex justify-between items-center mb-4">
                 <h2 className="text-xl font-bold text-gray-800 dark:text-white">Filters</h2>
                 <button className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">Clear all</button>
            </div>
           
            {/* Category Filters */}
            <div className="py-4 border-b dark:border-gray-700">
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Category</h3>
                <div className="space-y-2">
                    {categories.map(cat => (
                        <label key={cat} className="flex items-center gap-3 cursor-pointer dark:text-gray-300">
                            <input type="checkbox" name="category" value={cat} className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"/>
                            <span className="capitalize">{cat}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Price Filters */}
            <div className="py-4 border-b dark:border-gray-700">
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Price</h3>
                <div className="space-y-2">
                     {priceRanges.map(range => (
                         <label key={range.value} className="flex items-center gap-3 cursor-pointer dark:text-gray-300">
                            <input type="radio" name="price" value={range.value} onChange={handlePriceChange} className="h-4 w-4 border-gray-300 text-green-600 focus:ring-green-500" />
                            <span>{range.label}</span>
                        </label>
                    ))}
                </div>
            </div>
            
            {/* Size & Condition (Static UI) */}
             <div className="py-4 border-b dark:border-gray-700">
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Size</h3>
                <div className="space-y-2">
                    {sizes.map(size => (
                        <label key={size} className="flex items-center gap-3 cursor-pointer dark:text-gray-300">
                            <input type="checkbox" name="size" value={size} className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"/>
                            <span>{size}</span>
                        </label>
                    ))}
                </div>
            </div>
             <div className="py-4">
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Condition</h3>
                <div className="space-y-2">
                    {conditions.map(c => (
                        <label key={c} className="flex items-center gap-3 cursor-pointer dark:text-gray-300">
                            <input type="checkbox" name="condition" value={c} className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"/>
                            <span>{c}</span>
                        </label>
                    ))}
                </div>
            </div>

            <button className="w-full mt-6 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors font-semibold">
                Apply Filters
            </button>
        </aside>
    );
};

export default FilterSidebar;