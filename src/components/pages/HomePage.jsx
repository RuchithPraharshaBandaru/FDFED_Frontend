import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, TrendingUp, Sparkles } from 'lucide-react';
import ProductCard from '../ui/ProductCard';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { fetchProducts } from '../../services/api.js';
import { useFetchData } from '../../hooks';

const HomePage = () => {
    const { data, loading, error } = useFetchData(fetchProducts, []);
    // API may return either an array or an object like { products: [...] } or { data: { products: [...] } }
    const products = (() => {
        if (!data) return [];
        if (Array.isArray(data)) return data;
        if (Array.isArray(data.products)) return data.products;
        if (Array.isArray(data.data?.products)) return data.data.products;
        if (Array.isArray(data.data)) return data.data;
        return [];
    })();

    return (
        <div className="flex flex-col min-h-screen bg-background font-sans">
            
            {/* Hero Section - Compact Size */}
            <section className="relative w-full overflow-hidden border-b bg-mesh-gradient pt-6 pb-8 md:pt-12 md:pb-12">
                {/* Dots: Increased opacity for visibility in light mode */}
                <div className="absolute inset-0 bg-dot-pattern opacity-[0.15] pointer-events-none" />

                <div className="container relative mx-auto px-4 md:px-6">
                    {/* Reduced gap */}
                    <div className="grid gap-8 lg:grid-cols-2 items-center">
                        
                        {/* Text Content */}
                        <div className="flex flex-col justify-center space-y-5">
                            <div className="space-y-3">
                                <Badge variant="secondary" className="px-3 py-1 text-xs backdrop-blur-md bg-white/50 dark:bg-black/20 border-green-200 dark:border-green-900 text-green-700 dark:text-green-300 w-fit">
                                    <Sparkles className="mr-2 h-3 w-3 fill-green-500 text-green-500" />
                                    New Collection
                                </Badge>
                                {/* Reduced font size */}
                                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground leading-[1.1]">
                                    Fashion that <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-400">
                                        loves the planet.
                                    </span>
                                </h1>
                                <p className="max-w-[500px] text-base text-muted-foreground md:text-lg leading-relaxed">
                                    Join the circular economy. Shop ethically sourced, pre-loved fashion or sell your own clothes to reduce waste.
                                </p>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Link to="/store">
                                    <Button size="lg" className="h-10 px-6 text-sm md:text-base shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
                                        Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                                <Link to="/sell">
                                    <Button variant="outline" size="lg" className="h-10 px-6 text-sm md:text-base bg-white/50 dark:bg-black/50 backdrop-blur-sm">
                                        Sell Your Clothes
                                    </Button>
                                </Link>
                            </div>
                            
                            {/* Compact Stats */}
                            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border/50">
                                <div>
                                    <p className="text-xl font-bold text-foreground">10k+</p>
                                    <p className="text-xs text-muted-foreground">Items Saved</p>
                                </div>
                                <div>
                                    <p className="text-xl font-bold text-foreground">5k+</p>
                                    <p className="text-xs text-muted-foreground">Happy Users</p>
                                </div>
                                <div>
                                    <p className="text-xl font-bold text-foreground">100%</p>
                                    <p className="text-xs text-muted-foreground">Verified</p>
                                </div>
                            </div>
                        </div>

                        {/* Hero Image - Reduced Size */}
                        <div className="relative mx-auto w-full max-w-[350px] lg:max-w-[400px] perspective-1000 mt-4 lg:mt-0">
                            <div className="relative aspect-square overflow-hidden rounded-2xl border-4 border-white dark:border-gray-800 shadow-2xl rotate-2 hover:rotate-0 transition-all duration-500 ease-out group">
                                <img 
                                    src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80"
                                    alt="Sustainable Fashion"
                                    className="object-cover w-full h-full scale-105 group-hover:scale-100 transition-transform duration-700"
                                />
                                
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />

                                <div className="absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl p-3 rounded-lg shadow-lg border border-white/20 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-bold text-sm text-gray-900 dark:text-white">Summer Collection</p>
                                            <p className="text-[10px] text-gray-500 dark:text-gray-400">Recycled Cotton</p>
                                        </div>
                                        <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-none text-[10px] h-5">New</Badge>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Decorative Background Blob - Green Lighting Effect */}
                            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-gradient-to-tr from-green-600/30 via-emerald-400/35 to-green-300/40 dark:from-green-900/30 dark:via-emerald-800/35 dark:to-green-700/30 blur-2xl rounded-full pointer-events-none" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="relative py-8 bg-background border-b overflow-hidden">
                {/* Subtle gradient with lighter green tones */}
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-bl from-green-300/12 via-emerald-200/10 to-transparent dark:from-green-800/12 dark:via-emerald-900/8 blur-3xl rounded-full pointer-events-none" />
                <div className="container relative mx-auto px-4 md:px-6">
                    <div className="flex justify-between items-end mb-5">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">Shop by Category</h2>
                            <p className="text-muted-foreground mt-1 text-sm">Explore our most popular collections</p>
                        </div>
                        <Link to="/store">
                            {/* Changed to 'outline' so it is visible without hover */}
                            <Button variant="outline" size="sm" className="hidden md:flex">
                                View all categories <ArrowRight className="ml-2 h-4 w-4"/>
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Fashion Card */}
                        <Link to="/store?category=fashion" className="group relative overflow-hidden rounded-2xl border-1 border-green-200 dark:border-green-900 bg-background shadow-sm hover:shadow-lg hover:shadow-green-500/20 transition-all h-64 md:h-72">
                            <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/85 via-black/50 to-transparent flex flex-col justify-center p-8 transition-colors group-hover:from-black/90">
                                <h3 className="text-3xl font-bold text-white mb-2 transform translate-y-0 transition-transform group-hover:-translate-y-1">Fashion & Clothing</h3>
                                <p className="text-gray-200 mb-6 opacity-90 font-medium max-w-xs text-sm md:text-base">Up to 40% off on premium brands. Verified quality.</p>
                                <Button size="sm" className="w-fit bg-white text-black hover:bg-gray-100 border-none font-semibold shadow-md">Browse Collection</Button>
                            </div>
                            <img 
                                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1170&q=80" 
                                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                alt="Fashion"
                            />
                        </Link>

                        {/* Sell Card */}
                        <Link to="/sell" className="group relative overflow-hidden rounded-2xl border-1 border-emerald-200 dark:border-emerald-900 bg-background shadow-sm hover:shadow-lg hover:shadow-emerald-500/20 transition-all h-64 md:h-72">
                            <div className="absolute inset-0 z-10 bg-gradient-to-r from-emerald-950/92 via-emerald-900/55 to-transparent flex flex-col justify-center p-8 transition-colors group-hover:from-emerald-950">
                                <div className="flex items-center gap-2 mb-2 transform translate-y-0 transition-transform group-hover:-translate-y-1">
                                    <Sparkles className="text-yellow-400 h-5 w-5" />
                                    <h3 className="text-3xl font-bold text-white">Sell & Earn</h3>
                                </div>
                                <p className="text-gray-200 mb-6 opacity-90 font-medium max-w-xs text-sm md:text-base">Give your clothes a second life and earn rewards.</p>
                                <Button size="sm" className="w-fit bg-white text-emerald-900 hover:bg-gray-100 border-none font-semibold shadow-md">Start Selling</Button>
                            </div>
                            <img 
                                src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80" 
                                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                alt="Sell"
                            />
                        </Link>
                    </div>
                </div>
            </section>

            {/* --- 3. POPULAR PRODUCTS --- */}
            <section className="relative py-16 bg-muted/30 border-y overflow-hidden">
                {/* Gradient variations with darker/lighter greens */}
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-green-600/10 via-emerald-500/8 to-transparent dark:from-green-900/15 dark:via-emerald-800/10 blur-3xl rounded-full pointer-events-none" />
                <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-green-400/8 to-transparent dark:from-green-700/10 blur-3xl rounded-full pointer-events-none" />
                <div className="container relative mx-auto px-4 md:px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                        <div>
                            <Badge className="mb-2 bg-green-500 hover:bg-green-600 border-none text-white">Trending</Badge>
                            <h2 className="text-3xl font-bold tracking-tight text-foreground">Popular Products</h2>
                            <p className="text-muted-foreground mt-2 text-sm">The most sought-after pieces from our community.</p>
                        </div>
                        <Link to="/store">
                             <Button variant="outline" size="sm" className="group text-sm">
                                View all products <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </Link>
                    </div>

                    {loading && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[1,2,3,4].map(i => (
                                <div key={i} className="h-[380px] rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
                            ))}
                        </div>
                    )}
                    
                    {error && <div className="text-center text-destructive p-8 bg-destructive/10 rounded-lg">{error}</div>}
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.slice(0, 8).map((product, idx) => (
                            <ProductCard key={product?._id || product?.id || idx} {...product} />
                        ))}
                    </div>
                </div>
            </section>

            {/* --- 4. CTA SECTION --- */}
            <section className="py-16 relative overflow-hidden bg-background">
                <div className="container mx-auto px-4 md:px-6 relative">
                    <div className="bg-emerald-950 dark:bg-emerald-950 rounded-3xl p-10 md:p-16 text-center overflow-hidden relative shadow-2xl">
                        
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
                        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-emerald-500 opacity-20 blur-3xl" />
                        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-green-400 opacity-10 blur-3xl" />
                        
                        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                                Ready to declutter?
                            </h2>
                            <p className="text-gray-300 text-lg">
                                Turn your unused clothes into cash or donate them to support sustainable fashion. It takes less than 2 minutes.
                            </p>
                            <Link to="/sell" className="inline-block pt-2">
                                <Button size="lg" className="bg-white text-emerald-950 hover:bg-gray-100 h-12 px-8 text-base font-bold rounded-full border-1 border-white shadow-xl hover:shadow-2xl">
                                    Start Selling Now
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;