/**
 * Auth Slice – Unit Tests (Redux Reducer)
 *
 * Tests all synchronous auth reducer actions and selector functions.
 * The API service is mocked so no actual HTTP calls are made.
 */

// Mock the API service before importing the slice
jest.mock('../src/services/api', () => ({
  apiLogin: jest.fn(),
  apiSignup: jest.fn(),
  apiLogout: jest.fn(),
  apiCheckAuth: jest.fn(),
}));

const { configureStore } = require('@reduxjs/toolkit');
const authModule = require('../src/store/slices/authSlice');

const getReducer = () => authModule.default || authModule;

const createTestStore = (preloadedState) => {
  return configureStore({
    reducer: { auth: getReducer() },
    preloadedState: preloadedState ? { auth: preloadedState } : undefined,
  });
};

describe('Auth Slice', () => {
  let store;

  const sampleUser = {
    _id: 'user1',
    firstname: 'John',
    lastname: 'Doe',
    email: 'john@test.com',
    coins: 100,
  };

  beforeEach(() => {
    store = createTestStore();
  });

  // ── INITIAL STATE ─────────────────────────────────────────────────

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const state = store.getState().auth;
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.initialized).toBe(false);
    });
  });

  // ── SET USER ──────────────────────────────────────────────────────

  describe('setUser', () => {
    it('should set user and mark as authenticated', () => {
      store.dispatch(authModule.setUser({ user: sampleUser, token: 'abc123' }));
      const state = store.getState().auth;
      expect(state.user).toEqual(sampleUser);
      expect(state.token).toBe('abc123');
      expect(state.isAuthenticated).toBe(true);
    });
  });

  // ── UPDATE USER ───────────────────────────────────────────────────

  describe('updateUser', () => {
    it('should merge updates into existing user', () => {
      store.dispatch(authModule.setUser({ user: sampleUser, token: 'abc123' }));
      store.dispatch(authModule.updateUser({ firstname: 'Jane', coins: 200 }));
      const state = store.getState().auth;
      expect(state.user.firstname).toBe('Jane');
      expect(state.user.coins).toBe(200);
      expect(state.user.email).toBe('john@test.com'); // unchanged
    });
  });

  // ── CLEAR ERROR ───────────────────────────────────────────────────

  describe('clearError', () => {
    it('should set error to null', () => {
      store = createTestStore({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'Some error',
        initialized: false,
      });
      store.dispatch(authModule.clearError());
      const state = store.getState().auth;
      expect(state.error).toBeNull();
    });
  });

  // ── SELECTORS ─────────────────────────────────────────────────────

  describe('Selectors', () => {
    it('selectUser should return user from state', () => {
      store.dispatch(authModule.setUser({ user: sampleUser, token: 'token' }));
      const user = authModule.selectUser(store.getState());
      expect(user).toEqual(sampleUser);
    });

    it('selectIsAuthenticated should return auth status', () => {
      expect(authModule.selectIsAuthenticated(store.getState())).toBe(false);
      store.dispatch(authModule.setUser({ user: sampleUser, token: 'token' }));
      expect(authModule.selectIsAuthenticated(store.getState())).toBe(true);
    });

    it('selectAuthLoading should return loading state', () => {
      expect(authModule.selectAuthLoading(store.getState())).toBe(false);
    });

    it('selectAuthError should return error state', () => {
      expect(authModule.selectAuthError(store.getState())).toBeNull();
    });

    it('selectToken should return token', () => {
      store.dispatch(authModule.setUser({ user: sampleUser, token: 'mytoken' }));
      expect(authModule.selectToken(store.getState())).toBe('mytoken');
    });

    it('selectAuthInitialized should return initialized state', () => {
      expect(authModule.selectAuthInitialized(store.getState())).toBe(false);
    });
  });

  // ── ASYNC THUNK REDUCERS ──────────────────────────────────────────

  describe('Async Thunk Reducers', () => {
    const { apiLogin, apiCheckAuth } = require('../src/services/api');

    it('loginUser.fulfilled should set user and authenticate', async () => {
      apiLogin.mockResolvedValue({
        success: true,
        user: sampleUser,
        token: 'logintoken',
      });
      apiCheckAuth.mockRejectedValue(new Error('skip'));

      await store.dispatch(authModule.loginUser({ email: 'john@test.com', password: 'pass' }));
      const state = store.getState().auth;
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(sampleUser);
      expect(state.isLoading).toBe(false);
    });

    it('loginUser.rejected should set error', async () => {
      apiLogin.mockRejectedValue(new Error('Invalid credentials'));

      await store.dispatch(authModule.loginUser({ email: 'wrong@test.com', password: 'wrong' }));
      const state = store.getState().auth;
      expect(state.isAuthenticated).toBe(false);
      expect(state.error).toBe('Invalid credentials');
      expect(state.isLoading).toBe(false);
    });

    it('logoutUser.fulfilled should clear auth state', async () => {
      const { apiLogout } = require('../src/services/api');
      apiLogout.mockResolvedValue({ success: true });

      // First login
      store.dispatch(authModule.setUser({ user: sampleUser, token: 'token' }));
      expect(store.getState().auth.isAuthenticated).toBe(true);

      // Then logout
      await store.dispatch(authModule.logoutUser());
      const state = store.getState().auth;
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });

    it('checkAuth.fulfilled should set user from session', async () => {
      apiCheckAuth.mockResolvedValue({
        success: true,
        user: sampleUser,
        token: 'sessiontoken',
      });

      await store.dispatch(authModule.checkAuth());
      const state = store.getState().auth;
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(sampleUser);
      expect(state.initialized).toBe(true);
    });

    it('checkAuth.rejected should mark as initialized but not authenticated', async () => {
      apiCheckAuth.mockRejectedValue(new Error('Not authenticated'));

      await store.dispatch(authModule.checkAuth());
      const state = store.getState().auth;
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(state.initialized).toBe(true);
    });
  });
});
