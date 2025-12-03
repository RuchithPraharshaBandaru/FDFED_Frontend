# SwiftMart

A modern e-commerce platform with dedicated seller and buyer portals.

## Features

### Buyer Portal
- Product browsing and search
- Shopping cart management
- User authentication and account management
- Order history and tracking
- Checkout process
- Donation tracking

### Seller Portal ✨ NEW
- Dedicated seller dashboard with analytics
- Product management (Create, Read, Update, Delete)
- Order tracking and sales monitoring
- Profile and business information management
- Secure authentication with document verification
- Real-time inventory management

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173` (or next available port).

## Portal Access

### Buyer Portal
- Home: `http://localhost:5173/`
- Login: `http://localhost:5173/login`
- Signup: `http://localhost:5173/signup`

### Seller Portal
- Login: `http://localhost:5173/seller/login`
- Signup: `http://localhost:5173/seller/signup`
- Dashboard: `http://localhost:5173/seller/dashboard` (after login)

## Documentation

- **[Seller Portal Guide](./SELLER_GUIDE.md)** - Complete guide for seller features
- **[Seller Quick Reference](./SELLER_QUICK_REFERENCE.md)** - Quick reference for routes and APIs
- **[Components Guide](./COMPONENTS_GUIDE.md)** - UI components documentation
- **[Redux Guide](./REDUX_GUIDE.md)** - State management guide
- **[Refactoring Guide](./REFACTORING_GUIDE.md)** - Code refactoring guidelines

## Technology Stack

- **Frontend**: React 18 with Vite
- **State Management**: Redux Toolkit with Redux Persist
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **HTTP Client**: Fetch API with credentials support
- **Form Handling**: React hooks (useState, useEffect)

## Project Structure

```
src/
├── components/
│   ├── layouts/
│   │   ├── MainLayout.jsx
│   │   ├── AccountLayout.jsx
│   │   ├── SellerLayout.jsx      # Seller portal layout
│   │   └── SellerNavbar.jsx      # Seller navigation
│   ├── pages/
│   │   ├── [buyer pages...]
│   │   ├── SellerLoginPage.jsx
│   │   ├── SellerSignupPage.jsx
│   │   ├── SellerDashboardPage.jsx
│   │   ├── SellerProductsPage.jsx
│   │   ├── SellerCreateProductPage.jsx
│   │   ├── SellerEditProductPage.jsx
│   │   ├── SellerOrdersPage.jsx
│   │   └── SellerProfilePage.jsx
│   └── ui/                       # Reusable UI components
├── services/
│   ├── api.js                    # Buyer API calls
│   └── sellerApi.js              # Seller API calls
├── store/
│   ├── store.js
│   └── slices/
│       ├── authSlice.js          # Buyer authentication
│       ├── cartSlice.js
│       ├── themeSlice.js
│       └── sellerSlice.js        # Seller state management
└── utils/                        # Helper functions
```

## API Integration

### Backend Requirements
- Backend server should run on `http://localhost:8000`
- API endpoints: `/api/v1/user` (buyer) and `/api/v1/seller` (seller)
- Cookie-based authentication with HTTP-only cookies
- CORS enabled with credentials support

### API Documentation
See [Seller API Documentation](./SELLER_GUIDE.md#api-service-srcservicessellerapijs) for detailed endpoint information.

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8000
```

## Features in Detail

### Seller Dashboard
- Real-time statistics (products, sales, orders)
- Quick action buttons
- Recent products and sales overview
- Visual metrics with icons

### Product Management
- Grid view of all products
- Create products with image upload
- Edit product details
- Delete products with confirmation
- Stock status management
- Category-based organization

### Order Management
- Tabular view of all orders
- Order status tracking (Processing, Shipped, Delivered)
- Sales analytics
- Customer information display
- Revenue tracking

### Profile Management
- Update business information
- Manage address details
- View account information
- GSTN and contact details

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is part of the FDFED Frontend application.

## Support

For questions or issues:
- Check the documentation files
- Review the code comments
- Check the browser console for errors
- Verify API server is running


