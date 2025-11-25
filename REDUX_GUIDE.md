# Redux Implementation Guide

## Overview
This project uses **Redux Toolkit** with **Redux Persist** for centralized state management. The following features use Redux:

- ✅ **Cart Management** - Add, remove, update quantities
- ✅ **Authentication** - Login, signup, logout, user state
- ✅ **Theme** - Dark/light mode toggle with persistence

## Architecture

```
src/
├── store/
│   ├── store.js                 # Redux store configuration
│   └── slices/
│       ├── cartSlice.js         # Cart state & actions
│       ├── authSlice.js         # Auth state & async thunks
│       └── themeSlice.js        # Theme state & actions
```

## State Structure

### Cart State
```javascript
{
  items: [],           // Array of cart items
  totalQuantity: 0,    // Total number of items
  totalAmount: 0       // Total price
}
```

### Auth State
```javascript
{
  user: null,            // User object
  token: null,           // JWT token
  isAuthenticated: false,
  isLoading: false,
  error: null
}
```

### Theme State
```javascript
{
  mode: 'light'  // 'light' or 'dark'
}
```

## Usage Examples

### 1. Cart Management

**Add to Cart:**
```javascript
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';

const dispatch = useDispatch();

const handleAddToCart = (product) => {
  dispatch(addToCart(product));
};
```

**Get Cart Data:**
```javascript
import { useSelector } from 'react-redux';
import { selectCartItems, selectCartTotalQuantity, selectCartTotalAmount } from '../store/slices/cartSlice';

const cartItems = useSelector(selectCartItems);
const cartCount = useSelector(selectCartTotalQuantity);
const cartTotal = useSelector(selectCartTotalAmount);
```

**Available Cart Actions:**
- `addToCart(product)` - Add item to cart
- `removeFromCart(productId)` - Remove item from cart
- `incrementQuantity(productId)` - Increase quantity
- `decrementQuantity(productId)` - Decrease quantity
- `clearCart()` - Empty the cart
- `setCart(items)` - Sync with backend

### 2. Authentication

**Login:**
```javascript
import { useDispatch } from 'react-redux';
import { loginUser } from '../store/slices/authSlice';

const dispatch = useDispatch();

const handleLogin = async (email, password) => {
  const result = await dispatch(loginUser({ email, password }));
  if (result.type === 'auth/login/fulfilled') {
    // Login successful
  }
};
```

**Check Auth Status:**
```javascript
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUser } from '../store/slices/authSlice';

const isAuthenticated = useSelector(selectIsAuthenticated);
const user = useSelector(selectUser);
```

**Available Auth Actions:**
- `loginUser({ email, password })` - Async login
- `signupUser(userData)` - Async signup
- `logoutUser()` - Async logout
- `setUser({ user, token })` - Set user manually
- `updateUser(userData)` - Update user profile
- `clearError()` - Clear error messages

### 3. Theme Management

**Toggle Theme:**
```javascript
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme, selectTheme } from '../store/slices/themeSlice';

const dispatch = useDispatch();
const theme = useSelector(selectTheme);

const handleToggle = () => {
  dispatch(toggleTheme());
};
```

**Set Theme:**
```javascript
import { setTheme } from '../store/slices/themeSlice';

dispatch(setTheme('dark')); // or 'light'
```

## Persistence

All Redux state is automatically persisted to localStorage using `redux-persist`:

- State is saved on every change
- State is restored on page reload
- Whitelist: `cart`, `auth`, `theme`

## Migrated Components

### Already Migrated to Redux:
- ✅ `main.jsx` - Redux Provider setup
- ✅ `App.jsx` - Theme application
- ✅ `Navbar.jsx` - Cart count, auth status, theme toggle
- ✅ `ProtectedRoute.jsx` - Auth check
- ✅ `CartPage.jsx` - Full cart management
- ✅ `LoginPage.jsx` - Authentication
- ✅ `SignupPage.jsx` - User registration

### Still Using Context API:
- ⏳ `AccountPage.jsx` - Can use Redux for user updates
- ⏳ `ProductPage.jsx` - Can use Redux for cart actions
- ⏳ `CheckoutPage.jsx` - Can use Redux for cart data
- ⏳ `HomePage.jsx` - Can use Redux for cart actions

## Benefits of Redux

1. **Centralized State** - Single source of truth
2. **Persistence** - Automatic localStorage sync
3. **DevTools** - Redux DevTools for debugging
4. **Predictable** - Pure reducers, no side effects
5. **Scalable** - Easy to add new slices
6. **Type-Safe** - Better IDE autocomplete
7. **Async Handling** - Built-in async thunk support

## Best Practices

### 1. Use Selectors
```javascript
// ✅ Good
const cartItems = useSelector(selectCartItems);

// ❌ Avoid
const cartItems = useSelector(state => state.cart.items);
```

### 2. Dispatch Actions, Don't Mutate
```javascript
// ✅ Good
dispatch(addToCart(product));

// ❌ Never
state.cart.items.push(product);
```

### 3. Handle Async Operations
```javascript
// ✅ Good - Use async thunks
const result = await dispatch(loginUser(credentials));

// ❌ Avoid - Don't handle async in components
```

### 4. Use Redux for Global State Only
- ✅ Cart, Auth, Theme - shared across many components
- ❌ Form inputs, UI toggles - use local useState

## Redux DevTools

Install [Redux DevTools Extension](https://github.com/reduxjs/redux-devtools) to:
- Inspect state changes
- Time-travel debugging
- Track action history
- Export/import state

## Migration Checklist

To migrate a component from Context API to Redux:

1. Remove Context imports
2. Add Redux imports (`useSelector`, `useDispatch`)
3. Replace `useContext()` with `useSelector()`
4. Replace context methods with `dispatch(action())`
5. Test functionality
6. Remove old context file if no longer used

## Future Enhancements

Consider adding Redux slices for:
- Products (caching, filters)
- Orders (history, tracking)
- Wishlist (save for later)
- Notifications (toasts, alerts)
- UI State (modals, sidebars)
