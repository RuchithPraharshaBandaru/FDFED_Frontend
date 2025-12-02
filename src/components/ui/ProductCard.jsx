import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import Card from './Card';
import Button from './Button';
import Badge from './Badge';
import { calculateAverageRating, getReviewCount } from '../../utils/ratingHelpers';

const ProductCard = ({ _id, image, title, category, price, reviews = [] }) => {
    const averageRating = calculateAverageRating(reviews);
    const reviewCount = getReviewCount(reviews);
    return (
        <Card className="group relative overflow-hidden transition-all duration-300 shadow-md hover:shadow-2xl hover:shadow-green-700/30 border-2 border-border bg-card hover:border-green-700/40 hover:-translate-y-2 p-0 flex flex-col h-full">
            <Link to={`/product/${_id}`} className="flex flex-col h-full">
                {/* Image Container with Overlay */}
                <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                    <img 
                        src={image} 
                        alt={title} 
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                    
                    {/* Floating Badges */}
                    <div className="absolute left-3 top-3 flex flex-col gap-2">
                        {price < 1000 && <Badge variant="secondary" className="backdrop-blur-md bg-white/80 dark:bg-black/50">Great Value</Badge>}
                        <Badge className="bg-primary/90 text-white">Eco-Friendly</Badge>
                    </div>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-4">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{category}</span>
                        <div className="flex items-center gap-1 text-amber-400 text-xs">
                            <Star className={`h-3 w-3 ${averageRating ? 'fill-current' : ''}`} />
                            <span className="text-foreground font-semibold">
                                {averageRating || '~'}
                                {reviewCount > 0 && <span className="text-muted-foreground ml-0.5">({reviewCount})</span>}
                            </span>
                        </div>
                    </div>

                    <h3 className="font-semibold text-base leading-tight text-card-foreground group-hover:text-primary transition-colors line-clamp-2 mb-3">
                        {title}
                    </h3>

                    <div className="mt-auto pt-3 flex items-center justify-between border-t border-border/50">
                        <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground">Price</span>
                            <span className="text-lg font-bold text-primary">₹{price.toLocaleString()}</span>
                        </div>
                        {/* Button is now STATIC (always visible) instead of hover-only */}
                        <Button 
                            size="sm" 
                            className="h-8 text-xs gap-1.5"
                            onClick={(e) => {
                                e.preventDefault(); // Prevent navigation if adding to cart logic exists
                            }}
                        >
                            <ShoppingCart className="h-3.5 w-3.5" /> Add
                        </Button>
                    </div>
                </div>
            </Link>
        </Card>
    );
};

export default ProductCard;