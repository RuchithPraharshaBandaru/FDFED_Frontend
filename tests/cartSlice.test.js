/**
 * Cart Slice – Unit Tests (Redux Reducer)
 *
 * Tests all synchronous cart reducer actions.
 * The API service is mocked so no actual HTTP calls are made.
 */

// Mock the API service before importing the slice
jest.mock('../src/services/api', () => ({
  apiAddToCart: jest.fn(),
  apiRemoveFromCart: jest.fn(),
  apiDecreaseQuantity: jest.fn(),
  apiGetCart: jest.fn(),
  apiLogin: jest.fn(),
  apiSignup: jest.fn(),
  apiLogout: jest.fn(),
  apiCheckAuth: jest.fn(),
}));

const { configureStore } = require('@reduxjs/toolkit');
const cartModule = require('../src/store/slices/cartSlice');
const authModule = require('../src/store/slices/authSlice');

const getCartReducer = () => cartModule.default || cartModule;
const getAuthReducer = () => authModule.default || authModule;

const createTestStore = (preloadedState) => {
  return configureStore({
    reducer: {
      cart: getCartReducer(),
      auth: getAuthReducer(),
    },
    preloadedState: preloadedState ? preloadedState : undefined,
  });
};

describe('Cart Slice', () => {
  let store;

  const sampleProduct = {
    _id: 'prod1',
    title: 'Test Shirt',
    price: 500,
    image: 'test.jpg',
    size: 'M',
  };

  beforeEach(() => {
    store = createTestStore();
    jest.clearAllMocks();
  });

  // ── INITIAL STATE ─────────────────────────────────────────────────

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const state = store.getState().cart;
      expect(state.items).toEqual([]);
      expect(state.totalQuantity).toBe(0);
      expect(state.totalAmount).toBe(0);
      expect(state.isLoading).toBe(false);
    });
  });

  // ── ADD TO CART ───────────────────────────────────────────────────

  describe('addToCart', () => {
    it('should add a new item to cart', () => {
      store.dispatch(cartModule.addToCart(sampleProduct));
      const state = store.getState().cart;
      expect(state.items).toHaveLength(1);
      expect(state.items[0]._id).toBe('prod1');
      expect(state.items[0].quantity).toBe(1);
      expect(state.items[0].totalPrice).toBe(500);
      expect(state.totalQuantity).toBe(1);
      expect(state.totalAmount).toBe(500);
    });

    it('should increment quantity for existing item', () => {
      store.dispatch(cartModule.addToCart(sampleProduct));
      store.dispatch(cartModule.addToCart(sampleProduct));
      const state = store.getState().cart;
      expect(state.items).toHaveLength(1);
      expect(state.items[0].quantity).toBe(2);
      expect(state.items[0].totalPrice).toBe(1000);
      expect(state.totalQuantity).toBe(2);
      expect(state.totalAmount).toBe(1000);
    });

    it('should add different products as separate items', () => {
      const product2 = { _id: 'prod2', title: 'Jeans', price: 1200 };
      store.dispatch(cartModule.addToCart(sampleProduct));
      store.dispatch(cartModule.addToCart(product2));
      const state = store.getState().cart;
      expect(state.items).toHaveLength(2);
      expect(state.totalQuantity).toBe(2);
      expect(state.totalAmount).toBe(1700);
    });
  });

  // ── REMOVE FROM CART ──────────────────────────────────────────────

  describe('removeFromCart', () => {
    it('should remove an item completely from cart', () => {
      store.dispatch(cartModule.addToCart(sampleProduct));
      store.dispatch(cartModule.addToCart(sampleProduct)); // qty = 2
      store.dispatch(cartModule.removeFromCart('prod1'));
      const state = store.getState().cart;
      expect(state.items).toHaveLength(0);
      expect(state.totalQuantity).toBe(0);
      expect(state.totalAmount).toBe(0);
    });

    it('should do nothing when removing non-existent item', () => {
      store.dispatch(cartModule.addToCart(sampleProduct));
      store.dispatch(cartModule.removeFromCart('nonexistent'));
      const state = store.getState().cart;
      expect(state.items).toHaveLength(1);
    });
  });

  // ── INCREMENT QUANTITY ────────────────────────────────────────────

  describe('incrementQuantity', () => {
    it('should increment item quantity by 1', () => {
      store.dispatch(cartModule.addToCart(sampleProduct));
      store.dispatch(cartModule.incrementQuantity('prod1'));
      const state = store.getState().cart;
      expect(state.items[0].quantity).toBe(2);
      expect(state.items[0].totalPrice).toBe(1000);
      expect(state.totalQuantity).toBe(2);
    });

    it('should not affect other items', () => {
      const product2 = { _id: 'prod2', title: 'Jeans', price: 1200 };
      store.dispatch(cartModule.addToCart(sampleProduct));
      store.dispatch(cartModule.addToCart(product2));
      store.dispatch(cartModule.incrementQuantity('prod1'));
      const state = store.getState().cart;
      expect(state.items.find(i => i._id === 'prod1').quantity).toBe(2);
      expect(state.items.find(i => i._id === 'prod2').quantity).toBe(1);
    });
  });

  // ── DECREMENT QUANTITY ────────────────────────────────────────────

  describe('decrementQuantity', () => {
    it('should decrement item quantity by 1', () => {
      store.dispatch(cartModule.addToCart(sampleProduct));
      store.dispatch(cartModule.addToCart(sampleProduct)); // qty = 2
      store.dispatch(cartModule.decrementQuantity('prod1'));
      const state = store.getState().cart;
      expect(state.items[0].quantity).toBe(1);
      expect(state.totalQuantity).toBe(1);
    });

    it('should not decrement below 1', () => {
      store.dispatch(cartModule.addToCart(sampleProduct)); // qty = 1
      store.dispatch(cartModule.decrementQuantity('prod1'));
      const state = store.getState().cart;
      expect(state.items[0].quantity).toBe(1); // stays at 1
    });
  });

  // ── CLEAR CART ────────────────────────────────────────────────────

  describe('clearCart', () => {
    it('should remove all items and reset totals', () => {
      store.dispatch(cartModule.addToCart(sampleProduct));
      store.dispatch(cartModule.addToCart({ _id: 'prod2', title: 'Jeans', price: 1200 }));
      store.dispatch(cartModule.clearCart());
      const state = store.getState().cart;
      expect(state.items).toHaveLength(0);
      expect(state.totalQuantity).toBe(0);
      expect(state.totalAmount).toBe(0);
    });
  });

  // ── SET CART ───────────────────────────────────────────────────────

  describe('setCart', () => {
    it('should replace cart items and recalculate totals', () => {
      const items = [
        { _id: 'p1', price: 500, quantity: 2, totalPrice: 1000 },
        { _id: 'p2', price: 300, quantity: 1, totalPrice: 300 },
      ];
      store.dispatch(cartModule.setCart({ items }));
      const state = store.getState().cart;
      expect(state.items).toHaveLength(2);
      expect(state.totalQuantity).toBe(3);
      expect(state.totalAmount).toBe(1300);
    });
  });

  // ── ASYNC THUNKS ──────────────────────────────────────────────────

  describe('Async Thunks', () => {
    const { apiAddToCart, apiGetCart } = require('../src/services/api');

    it('addToCartAsync should add item after API call succeeds', async () => {
      apiAddToCart.mockResolvedValue({ success: true });

      await store.dispatch(cartModule.addToCartAsync({ product: sampleProduct, size: 'M' }));
      const state = store.getState().cart;
      expect(state.items).toHaveLength(1);
      expect(state.items[0]._id).toBe('prod1');
      expect(state.items[0].size).toBe('M');
    });

    it('fetchCartItems should populate cart from backend', async () => {
      apiGetCart.mockResolvedValue({
        cart: [
          {
            productId: { _id: 'p1', title: 'Shirt', price: 500 },
            quantity: 2,
            size: 'L',
          },
        ],
      });

      await store.dispatch(cartModule.fetchCartItems());
      const state = store.getState().cart;
      expect(state.items).toHaveLength(1);
      expect(state.items[0]._id).toBe('p1');
      expect(state.items[0].quantity).toBe(2);
    });

    it('fetchCartItems should handle empty cart', async () => {
      apiGetCart.mockResolvedValue({ cart: [] });

      await store.dispatch(cartModule.fetchCartItems());
      const state = store.getState().cart;
      expect(state.items).toHaveLength(0);
    });

    it('cart should clear on logout', async () => {
      const { apiLogout } = require('../src/services/api');
      apiLogout.mockResolvedValue({ success: true });

      // Add items first
      store.dispatch(cartModule.addToCart(sampleProduct));
      expect(store.getState().cart.items).toHaveLength(1);

      // Logout should clear cart
      await store.dispatch(authModule.logoutUser());
      const state = store.getState().cart;
      expect(state.items).toHaveLength(0);
      expect(state.totalQuantity).toBe(0);
      expect(state.totalAmount).toBe(0);
    });
  });

  // ── SELECTORS ─────────────────────────────────────────────────────

  describe('Selectors', () => {
    it('selectCartItems should return items array', () => {
      store.dispatch(cartModule.addToCart(sampleProduct));
      const items = cartModule.selectCartItems(store.getState());
      expect(items).toHaveLength(1);
    });

    it('selectCartTotalQuantity should return total quantity', () => {
      store.dispatch(cartModule.addToCart(sampleProduct));
      store.dispatch(cartModule.addToCart(sampleProduct));
      expect(cartModule.selectCartTotalQuantity(store.getState())).toBe(2);
    });

    it('selectCartTotalAmount should return total amount', () => {
      store.dispatch(cartModule.addToCart(sampleProduct));
      expect(cartModule.selectCartTotalAmount(store.getState())).toBe(500);
    });

    it('selectCartLoading should return loading state', () => {
      expect(cartModule.selectCartLoading(store.getState())).toBe(false);
    });
  });
});
