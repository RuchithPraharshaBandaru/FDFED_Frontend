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

const CheckboxItem = ({ label, name, value, onChange }) => (
    <label className="flex items-center gap-3 cursor-pointer group">
        <div className="relative flex items-center">
            <input 
                type="checkbox" 
                name={name} 
                value={value} 
                className="peer h-4 w-4 rounded border-input text-primary focus:ring-primary/20"
                onChange={onChange}
            />
        </div>
        <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors select-none">
            {label}
        </span>
    </label>
);

const FilterSidebar = ({ filters, onFilterChange }) => {
    const handleCategoryChange = (e) => onFilterChange('category', e.target.value);
    
    const handlePriceChange = (e) => {
        const [min, max] = e.target.value.split('-');
        onFilterChange('price', { minPrice: min || null, maxPrice: max || null });
    };

    return (
        <aside className="w-64 flex-shrink-0 hidden lg:block">
            <div className="sticky top-24 space-y-1">
                <div className="flex justify-between items-center mb-2 px-1">
                     <h2 className="text-lg font-bold tracking-tight">Filters</h2>
                     <Button variant="link" size="sm" className="h-auto p-0 text-muted-foreground">Reset</Button>
                </div>
               
                <div className="rounded-lg border bg-card text-card-foreground px-4 shadow-sm">
                    <FilterSection title="Category">
                        {['Silk', 'Fabric', 'Cotton', 'Wool', 'Linen', 'Cashmere'].map(cat => (
                            <CheckboxItem 
                                key={cat} 
                                label={cat} 
                                name="category" 
                                value={cat.toLowerCase()} 
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
                    
                    <FilterSection title="Condition">
                        {['New w/ Tags', 'Like New', 'Gently Used'].map(c => (
                            <CheckboxItem key={c} label={c} name="condition" value={c} onChange={()=>{}} />
                        ))}
                    </FilterSection>

                    <div className="py-4">
                        <Button className="w-full">Apply Filters</Button>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default FilterSidebar;