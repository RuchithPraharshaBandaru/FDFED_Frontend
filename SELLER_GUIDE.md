# Seller Portal Guide

## Overview

The Seller Portal is a complete seller management system integrated into the FDFED Frontend application. It provides sellers with a dedicated dashboard to manage their products, track orders, and handle their business operations.

## Features

### 1. **Authentication**
- **Seller Login** (`/seller/login`)
  - Email and password authentication
  - Secure cookie-based session management
  - Auto-redirect to dashboard after successful login

- **Seller Signup** (`/seller/signup`)
  - Comprehensive registration form with required fields:
    - Personal: Name, Email, Password, Phone Number
    - Business: Store Name, GSTN
    - Documents: Profile Image, Aadhaar Card (required)
    - Optional: Bank Details, Address
  - File upload for identity verification
  - Multi-step form with validation

### 2. **Dashboard** (`/seller/dashboard`)
- Quick statistics overview:
  - Total Products
  - In-Stock Products
  - Total Sales Revenue
  - Total Orders
- Recent products list (last 5)
- Recent sales/orders (last 5)
- Quick action buttons for common tasks
- Visual charts and metrics

### 3. **Product Management** (`/seller/products`)
- View all seller products in a grid layout
- Product cards showing:
  - Product image
  - Title and description
  - Price and quantity
  - Category
  - Stock status (badge)
- Edit and Delete actions for each product
- Empty state with call-to-action

### 4. **Create Product** (`/seller/products/create`)
- Complete product creation form:
  - Product image upload with preview
  - Title, Price, Description
  - Category selection (dropdown)
  - Quantity management
  - Stock status toggle
- Form validation
- Image preview before upload
- Success/error feedback

### 5. **Edit Product** (`/seller/products/edit/:id`)
- Pre-populated form with existing product data
- Update product information (except image)
- Real-time validation
- Auto-fetch product details from Redux or API

### 6. **Orders Management** (`/seller/orders`)
- Complete order listing table
- Order statistics:
  - Total Orders
  - Total Revenue
  - Items Sold
- Order details display:
  - Order ID
  - Product name and price
  - Customer name
  - Quantity and total amount
  - Order date
  - Status badges (Delivered/Shipped/Processing)
- Responsive table design

### 7. **Seller Profile** (`/seller/profile`)
- Edit seller information:
  - Basic Information (Name, Email, Store Name, Phone)
  - Business Information (GSTN)
  - Address Details (Street, City, State, PIN, Country)
- Account information display
- Success/error notifications
- Form validation

## Technical Architecture

### State Management (Redux)

**Seller Slice** (`src/store/slices/sellerSlice.js`)
- State properties:
  - `seller`: Current seller object
  - `isAuthenticated`: Authentication status
  - `loading`: Loading state
  - `error`: Error messages
  - `products`: Array of seller products
  - `soldProducts`: Array of sold products/orders
  - `productsLoading`: Products fetch loading state
  - `soldProductsLoading`: Sold products fetch loading state

- Actions:
  - `loginSeller`: Authenticate seller
  - `logoutSeller`: Clear session
  - `signupSeller`: Register new seller
  - `fetchSellerProfile`: Get seller details
  - `updateSellerProfile`: Update seller info
  - `fetchSellerProducts`: Get all products
  - `fetchSoldProducts`: Get order history
  - `updateProduct`: Update product in store
  - `removeProduct`: Remove product from store
  - `addProduct`: Add new product to store

### API Service (`src/services/sellerApi.js`)

**Base URL**: `http://localhost:8000/api/v1/seller`

**Authentication Endpoints**:
- `apiSellerLogin(credentials)` - POST /login
- `apiSellerLogout()` - GET /logout
- `apiSellerSignup(formData)` - POST /signup

**Account Endpoints**:
- `apiGetSellerProfile()` - GET /account/me
- `apiUpdateSellerProfile(updateData)` - PATCH /account

**Product Endpoints**:
- `apiGetSellerProducts()` - GET /products
- `apiGetProduct(id)` - GET /product/:id
- `apiCreateProduct(productData)` - POST /create
- `apiUpdateProduct(id, updateData)` - POST /update/:id
- `apiDeleteProduct(id)` - DELETE /product/:id

**Order Endpoints**:
- `apiGetSoldProducts()` - GET /sold-products/data

All API calls include `credentials: 'include'` for cookie-based authentication.

### Routing Structure

```
/seller
├── /login (public)
├── /signup (public)
└── / (protected - SellerLayout)
    ├── /dashboard
    ├── /products
    ├── /products/create
    ├── /products/edit/:id
    ├── /orders
    └── /profile
```

### Components

**Layouts**:
- `SellerLayout`: Protected route wrapper with authentication check
- `SellerNavbar`: Navigation bar for seller dashboard

**Pages**:
- `SellerLoginPage`: Login form
- `SellerSignupPage`: Registration form
- `SellerDashboardPage`: Main dashboard
- `SellerProductsPage`: Product listing
- `SellerCreateProductPage`: Create product form
- `SellerEditProductPage`: Edit product form
- `SellerOrdersPage`: Orders/sales listing
- `SellerProfilePage`: Profile management

### Authentication Flow

1. User navigates to `/seller/login`
2. Enters credentials and submits
3. API call sets HTTP-only cookie
4. Redux state updated with seller data
5. Auto-redirect to `/seller/dashboard`
6. Protected routes check `isAuthenticated` state
7. If not authenticated, redirect to `/seller/login`

### Protected Routes

The `SellerLayout` component:
- Checks authentication status
- Fetches seller profile if needed
- Shows loading state during verification
- Redirects to login if not authenticated
- Renders seller navbar and outlet for authenticated users

## Usage Examples

### Login a Seller
```javascript
// Automatic via Redux
dispatch(loginSeller({ email: 'seller@example.com', password: 'password123' }));
```

### Create a Product
```javascript
const formData = new FormData();
formData.append('title', 'Product Name');
formData.append('price', 99.99);
formData.append('description', 'Product description');
formData.append('category', 'Electronics');
formData.append('quantity', 10);
formData.append('stock', true);
formData.append('img', imageFile);

await apiCreateProduct(formData);
```

### Update Seller Profile
```javascript
dispatch(updateSellerProfile({
  name: 'Updated Name',
  phoneNumber: '1234567890',
  address: {
    street: '123 Main St',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    country: 'India'
  }
}));
```

## File Upload Requirements

### Signup Documents:
- **Profile Image**: Required, image format
- **Aadhaar Card**: Required, image format

### Product Image:
- **Product Image**: Required for creation, image format
- Supports preview before upload
- Cannot be updated via edit (noted in UI)

## Navigation

Access seller portal:
1. Visit `http://localhost:5174/seller/login`
2. Or signup at `http://localhost:5174/seller/signup`
3. After login, access dashboard at `http://localhost:5174/seller/dashboard`

## Best Practices

1. **Always check authentication** before allowing access to seller routes
2. **Validate forms** on both client and server side
3. **Handle file uploads** with proper FormData construction
4. **Show loading states** during API calls
5. **Display meaningful error messages** to users
6. **Use Redux for state management** to keep UI in sync
7. **Implement optimistic updates** where appropriate
8. **Clear sensitive data** on logout

## Error Handling

All API calls are wrapped with try-catch blocks and:
- Display user-friendly error messages
- Log errors for debugging
- Maintain application stability
- Provide feedback through Alert components

## Future Enhancements

Potential improvements:
- Real-time order notifications
- Advanced analytics and charts
- Bulk product operations
- Product image gallery (multiple images)
- CSV import/export for products
- Sales reports and downloads
- Inventory management alerts
- Customer reviews management
- Multi-language support
- Mobile app integration

## Support

For issues or questions:
1. Check console for errors
2. Verify API endpoint is running
3. Ensure cookies are enabled
4. Check network tab for failed requests
5. Review Redux DevTools for state issues
