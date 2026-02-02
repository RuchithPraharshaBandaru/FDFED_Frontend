// Constants for donation points calculation
export const POINTS_TABLE = [
    { s: 'S', f: 'Cotton', u: '< 1 yr', p: 200 },
    { s: 'M', f: 'Cotton', u: '< 1 yr', p: 250 },
    { s: 'L', f: 'Cotton', u: '< 1 yr', p: 300 },
    { s: 'S', f: 'Silk', u: '< 1 yr', p: 300 },
    { s: 'M', f: 'Silk', u: '< 1 yr', p: 350 },
    { s: 'L', f: 'Silk', u: '< 1 yr', p: 400 },
    { s: 'S', f: 'Linen', u: '< 1 yr', p: 220 },
    { s: 'M', f: 'Linen', u: '< 1 yr', p: 270 },
    { s: 'L', f: 'Linen', u: '< 1 yr', p: 320 },
    { s: 'S', f: 'Leather', u: '< 1 yr', p: 450 },
    { s: 'M', f: 'Leather', u: '< 1 yr', p: 550 },
    { s: 'L', f: 'Leather', u: '< 1 yr', p: 600 },
    { s: 'S', f: 'Cashmere', u: '< 1 yr', p: 400 },
    { s: 'M', f: 'Cashmere', u: '< 1 yr', p: 450 },
    { s: 'L', f: 'Cashmere', u: '< 1 yr', p: 500 },
    { s: 'S', f: 'Cotton', u: '> 1 yr', p: 140 },
    { s: 'M', f: 'Cotton', u: '> 1 yr', p: 180 },
    { s: 'L', f: 'Cotton', u: '> 1 yr', p: 220 },
    { s: 'S', f: 'Silk', u: '> 1 yr', p: 220 },
    { s: 'M', f: 'Silk', u: '> 1 yr', p: 260 },
    { s: 'L', f: 'Silk', u: '> 1 yr', p: 300 },
    { s: 'S', f: 'Linen', u: '> 1 yr', p: 160 },
    { s: 'M', f: 'Linen', u: '> 1 yr', p: 200 },
    { s: 'L', f: 'Linen', u: '> 1 yr', p: 240 },
    { s: 'S', f: 'Leather', u: '> 1 yr', p: 300 },
    { s: 'M', f: 'Leather', u: '> 1 yr', p: 350 },
    { s: 'L', f: 'Leather', u: '> 1 yr', p: 400 },
    { s: 'S', f: 'Cashmere', u: '> 1 yr', p: 300 },
    { s: 'M', f: 'Cashmere', u: '> 1 yr', p: 350 },
    { s: 'L', f: 'Cashmere', u: '> 1 yr', p: 400 },
];

// Categories for filtering
export const CATEGORIES = [
    'Silk',
    'Fabric', 
    'Cotton',
    'Wool',
    'Linen',
    'Cashmere',
    'Leather'
];

// Fabric types for donation form
export const FABRIC_TYPES = [
    'Cotton',
    'Silk',
    'Wool',
    'Linen',
    'Denim',
    'Polyester',
    'Leather',
    'Cashmere',
    'Other'
];

// Size options
export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

// Gender options
export const GENDERS = ['Male', 'Female', 'Unisex'];

// Usage duration options
export const USAGE_DURATIONS = [
    '< 1 year',
    '6-12 months',
    '> 1 year'
];

// Price ranges for filtering
export const PRICE_RANGES = [
    { label: 'Under ₹500', value: '0-500' },
    { label: '₹500 - ₹1000', value: '500-1000' },
    { label: 'Over ₹1000', value: '1000-' }
];

// Sort options
export const SORT_OPTIONS = [
    { value: 'newest', label: 'Sort by: Newest' },
    { value: 'price-low-high', label: 'Price: Low to High' },
    { value: 'price-high-low', label: 'Price: High to Low' },
    { value: 'rating', label: 'Rating: Highest First' },
    { value: 'popular', label: 'Most Popular' }
];

// Time slots for donation pickup
export const TIME_SLOTS = [
    '9:00 AM - 11:00 AM',
    '11:00 AM - 1:00 PM',
    '2:00 PM - 4:00 PM',
    '4:00 PM - 6:00 PM'
];
