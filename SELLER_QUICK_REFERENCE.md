# Seller Portal - Quick Reference

## Routes

### Public Routes
- `/seller/login` - Seller login page
- `/seller/signup` - Seller registration page

### Protected Routes (requires authentication)
- `/seller/dashboard` - Main dashboard with statistics
- `/seller/products` - List all products
- `/seller/products/create` - Create new product
- `/seller/products/edit/:id` - Edit existing product
- `/seller/orders` - View all orders/sales
- `/seller/profile` - Manage seller profile

## API Endpoints

**Base URL**: `http://localhost:8000/api/v1/seller`

### Authentication
| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---------------|
| POST | `/login` | Seller login | No |
| GET | `/logout` | Seller logout | Yes |
| POST | `/signup` | Seller registration | No |

### Account
| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---------------|
| GET | `/account/me` | Get seller profile | Yes |
| PATCH | `/account` | Update seller profile | Yes |

### Products
| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---------------|
| GET | `/products` | List all seller products | Yes |
| GET | `/product/:id` | Get single product | Yes |
| POST | `/create` | Create new product | Yes |
| POST | `/update/:id` | Update product | Yes |
| DELETE | `/product/:id` | Delete product | Yes |

### Orders
| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---------------|
| GET | `/sold-products/data` | Get sold products/orders | Yes |

## Redux Actions

### Authentication
```javascript
dispatch(loginSeller({ email, password }))
dispatch(logoutSeller())
dispatch(signupSeller(formData))
```

### Profile
```javascript
dispatch(fetchSellerProfile())
dispatch(updateSellerProfile(updateData))
```

### Products
```javascript
dispatch(fetchSellerProducts())
dispatch(updateProduct(product))
dispatch(removeProduct(productId))
dispatch(addProduct(product))
```

### Orders
```javascript
dispatch(fetchSoldProducts())
```

## Component Imports

```javascript
// Pages
import { SellerLoginPage } from './components/pages/SellerLoginPage';
import { SellerSignupPage } from './components/pages/SellerSignupPage';
import { SellerDashboardPage } from './components/pages/SellerDashboardPage';
import { SellerProductsPage } from './components/pages/SellerProductsPage';
import { SellerCreateProductPage } from './components/pages/SellerCreateProductPage';
import { SellerEditProductPage } from './components/pages/SellerEditProductPage';
import { SellerOrdersPage } from './components/pages/SellerOrdersPage';
import { SellerProfilePage } from './components/pages/SellerProfilePage';

// Layouts
import { SellerLayout } from './components/layouts/SellerLayout';
import { SellerNavbar } from './components/layouts/SellerNavbar';

// Redux
import { sellerSlice } from './store/slices/sellerSlice';

// API
import * as sellerApi from './services/sellerApi';
```

## Sample Data Structures

### Seller Object
```javascript
{
  _id: "seller123",
  name: "John Doe",
  email: "seller@example.com",
  storeName: "John's Store",
  gstn: "22AAAAA0000A1Z5",
  phoneNumber: "9876543210",
  address: {
    street: "123 Main St",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
    country: "India"
  },
  createdAt: "2025-01-01T00:00:00.000Z"
}
```

### Product Object
```javascript
{
  _id: "product123",
  title: "Product Name",
  price: 99.99,
  description: "Product description",
  category: "Electronics",
  quantity: 10,
  stock: true,
  image: "https://example.com/image.jpg"
}
```

### Order Object
```javascript
{
  id: "order123",
  name: "Product Name",
  price: 99.99,
  quantity: 2,
  buyerName: "Customer Name",
  orderDate: "2025-12-03",
  status: "Delivered", // or "Shipped" or "Processing"
  totalAmount: 199.98
}
```

## Common Patterns

### Creating FormData for File Upload
```javascript
const formData = new FormData();
formData.append('title', 'Product Name');
formData.append('price', 99.99);
formData.append('img', imageFile);
```

### Protected Route Check
```javascript
const { isAuthenticated, seller } = useSelector((state) => state.seller);

if (!isAuthenticated || !seller) {
  return <Navigate to="/seller/login" replace />;
}
```

### Error Handling
```javascript
try {
  await dispatch(loginSeller(credentials)).unwrap();
} catch (error) {
  setError(error);
}
```

## Testing the Seller Portal

1. Start the backend server (should be running on `http://localhost:8000`)
2. Start the frontend dev server: `npm run dev`
3. Navigate to `http://localhost:5174/seller/signup`
4. Create a seller account with required documents
5. Login and explore the dashboard

## Categories Available
- Electronics
- Clothing
- Home & Garden
- Books
- Sports
- Toys
- Health & Beauty
- Automotive
- Food & Beverages
- Other
