import React from 'react';
import Button from './Button';

const FilterSection = ({ title, children }) => (
    <div className="py-5 border-b border-border last:border-0">
        <h3 className="font-semibold text-sm mb-3 text-foreground">{title}</h3>
        <div className="space-y-2.5">
            {children}
        </div>
    </div>
);

const CheckboxItem = ({ label, name, value, onChange, checked }) => (
    <label className="flex items-center gap-3 cursor-pointer group">
        <div className="relative flex items-center">
            <input 
                type="checkbox" 
                name={name} 
                value={value} 
                checked={checked}
                className="peer h-4 w-4 rounded border-input text-primary focus:ring-primary/20"
                onChange={onChange}
            />
        </div>
        <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors select-none">
            {label}
        </span>
    </label>
);

const FilterSidebar = ({ filters, onFilterChange, onResetFilters, sortBy, onSortChange }) => {
    const handleCategoryChange = (e) => {
        onFilterChange('category', e.target.value, e.target.checked);
    };
    
    const handlePriceChange = (e) => {
        const [min, max] = e.target.value.split('-');
        onFilterChange('price', { minPrice: min || null, maxPrice: max || null });
    };

    return (
        <aside className="w-64 flex-shrink-0 mt-26 hidden lg:block mr-8">
            <div className="sticky top-28 space-y-1">
                <div className="flex justify-between items-center mb-3 px-1">
                     <h2 className="text-lg font-bold tracking-tight">Filters</h2>
                     <Button 
                        variant="link" 
                        size="sm" 
                        className="h-auto p-0 text-muted-foreground hover:text-green-600 dark:hover:text-green-400"
                        onClick={onResetFilters}
                     >
                        Reset
                     </Button>
                </div>
               
                {/* Gradient border container */}
                <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 dark:from-green-500 dark:to-emerald-600 p-[2px] rounded-2xl shadow-xl shadow-green-500/15 dark:shadow-green-500/30">
                    <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl px-4 overflow-hidden">
                    
                    {/* --- Sort By Section (Added) --- */}
                    

                    <FilterSection title="Category">
                        {['Silk', 'Fabric', 'Cotton', 'Wool', 'Linen', 'Cashmere'].map(cat => (
                            <CheckboxItem 
                                key={cat} 
                                label={cat} 
                                name="category" 
                                value={cat.toLowerCase()} 
                                checked={filters.categories?.includes(cat.toLowerCase())}
                                onChange={handleCategoryChange} 
                            />
                        ))}
                    </FilterSection>

                    <FilterSection title="Price Range">
                        {[
                            { label: 'Under ₹500', value: '0-500' },
                            { label: '₹500 - ₹1000', value: '500-1000' },
                            { label: 'Over ₹1000', value: '1000-' }
                        ].map(range => (
                            <label key={range.value} className="flex items-center gap-3 cursor-pointer group">
                                <input 
                                    type="radio" 
                                    name="price" 
                                    value={range.value} 
                                    onChange={handlePriceChange}
                                    className="h-4 w-4 border-input text-primary focus:ring-primary/20" 
                                />
                                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                                    {range.label}
                                </span>
                            </label>
                        ))}
                    </FilterSection>

                    <FilterSection title="Sort By">
                        {[
                            { label: 'Newest', value: 'newest' },
                            { label: 'Price: Low to High', value: 'price-low-high' },
                            { label: 'Price: High to Low', value: 'price-high-low' },
                            { label: 'Highest Rated', value: 'rating' },
                            { label: 'Most Popular', value: 'popular' }
                        ].map(option => (
                            <label key={option.value} className="flex items-center gap-3 cursor-pointer group">
                                <input 
                                    type="radio" 
                                    name="sortBy" 
                                    value={option.value} 
                                    checked={sortBy === option.value}
                                    onChange={onSortChange}
                                    className="h-4 w-4 border-input text-primary focus:ring-primary/20" 
                                />
                                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                                    {option.label}
                                </span>
                            </label>
                        ))}
                    </FilterSection>
                    
                    {/* Condition Section REMOVED as requested */}

                    <div className="py-4">
                        <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg shadow-green-500/30">Apply Filters</Button>
                    </div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default FilterSidebar;