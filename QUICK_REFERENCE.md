# Quick Reference - Custom Hooks & Utilities

## 🎣 Custom Hooks

### useFetchData
Fetch data with automatic loading/error handling
```javascript
const { data, loading, error, refetch } = useFetchData(apiFunction, dependencies);
```

### useFormState  
Manage form state easily
```javascript
const { formData, handleChange, resetForm, setFormField } = useFormState(initialState);
```

### usePagination
Handle pagination logic
```javascript
const { 
  currentPage, 
  totalPages, 
  currentItems, 
  handlePageChange, 
  handlePrevPage, 
  handleNextPage, 
  resetPage 
} = usePagination(items, itemsPerPage);
```

### useToggle
Boolean state toggling
```javascript
const [value, toggle, setTrue, setFalse] = useToggle(initialValue);
```

---

## 🛠️ Utility Functions

### Rating Helpers
```javascript
calculateAverageRating(reviews)  // Returns average or null
getReviewCount(reviews)           // Returns count
formatRatingDisplay(reviews)      // Returns "4.5 (12)" or "~"
```

### Sort Helpers
```javascript
sortProducts(products, sortBy)    // Main sorter
sortByPriceLowToHigh(products)
sortByPriceHighToLow(products)
sortByRating(products)
sortByPopularity(products)
```

### Formatters
```javascript
formatPrice(price, currency)      // "₹1,000"
formatDate(date)                  // "12/3/2025"
formatDateTime(date)              // "12/3/2025, 10:30 AM"
truncateText(text, maxLength)     // "Lorem ipsum..."
```

### Validators
```javascript
isValidEmail(email)               // true/false
validatePassword(password)        // { isValid, message }
validateRequiredFields(data, fields) // { isValid, missingFields, message }
isValidPhone(phone)              // true/false
isValidPincode(pincode)          // true/false
```

---

## 📦 Constants

```javascript
import { 
  CATEGORIES,        // Product categories
  FABRIC_TYPES,      // Fabric options
  SIZES,             // Size options
  GENDERS,           // Gender options
  PRICE_RANGES,      // Price filter ranges
  SORT_OPTIONS,      // Sort dropdown options
  TIME_SLOTS,        // Pickup time slots
  POINTS_TABLE       // Donation points data
} from '../../utils/constants';
```

---

## 📥 Import Patterns

```javascript
// Single import
import { useFetchData } from '../../hooks';

// Multiple imports from hooks
import { useFetchData, useFormState, usePagination } from '../../hooks';

// Multiple imports from utils
import { 
  calculateAverageRating, 
  sortProducts, 
  formatPrice 
} from '../../utils';

// Mixed imports
import { useFetchData } from '../../hooks';
import { formatPrice, CATEGORIES } from '../../utils';
```

---

## ✅ Usage Examples

### Fetching Data
```javascript
import { useFetchData } from '../../hooks';
import { apiGetProducts } from '../../services/api';

const MyComponent = () => {
  const { data: products, loading, error, refetch } = useFetchData(
    apiGetProducts, 
    [] // dependencies
  );
  
  if (loading) return <Spinner />;
  if (error) return <Error message={error} />;
  
  return <ProductList products={products} onRefresh={refetch} />;
};
```

### Form Handling
```javascript
import { useFormState } from '../../hooks';

const MyForm = () => {
  const { formData, handleChange, resetForm } = useFormState({
    name: '',
    email: ''
  });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitData(formData);
    resetForm();
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={formData.name} onChange={handleChange} />
      <input name="email" value={formData.email} onChange={handleChange} />
      <button type="submit">Submit</button>
    </form>
  );
};
```

### Pagination
```javascript
import { usePagination } from '../../hooks';

const MyList = ({ items }) => {
  const { 
    currentItems, 
    currentPage, 
    totalPages,
    handlePageChange 
  } = usePagination(items, 10);
  
  return (
    <>
      <ItemList items={currentItems} />
      <Pagination 
        current={currentPage} 
        total={totalPages} 
        onChange={handlePageChange} 
      />
    </>
  );
};
```

### Sorting Products
```javascript
import { useMemo, useState } from 'react';
import { sortProducts } from '../../utils/sortHelpers';

const ProductGrid = ({ products }) => {
  const [sortBy, setSortBy] = useState('newest');
  
  const sorted = useMemo(() => 
    sortProducts(products, sortBy), 
    [products, sortBy]
  );
  
  return (
    <>
      <SortDropdown value={sortBy} onChange={setSortBy} />
      <Grid items={sorted} />
    </>
  );
};
```

### Rating Display
```javascript
import { calculateAverageRating, getReviewCount } from '../../utils';

const ProductCard = ({ reviews }) => {
  const rating = calculateAverageRating(reviews);
  const count = getReviewCount(reviews);
  
  return (
    <div>
      <Star filled={!!rating} />
      <span>{rating || '~'}</span>
      {count > 0 && <span>({count})</span>}
    </div>
  );
};
```

---

## 🎯 Best Practices

1. **Always use hooks at the top level** of your component
2. **Memoize expensive computations** with useMemo when using utils
3. **Destructure what you need** from hook returns
4. **Use constants** instead of hardcoded strings
5. **Import from index files** for cleaner imports

---

## 🚀 Performance Tips

- `usePagination` already memoizes current items
- `sortProducts` creates a new array - wrap in useMemo
- `useFetchData` auto-manages loading states
- Constants are defined once and reused

---

For detailed documentation, see `REFACTORING_GUIDE.md`
