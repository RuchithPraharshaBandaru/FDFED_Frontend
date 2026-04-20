/**
 * Shared test setup for frontend tests.
 * Provides environment stubs and global mocks.
 *
 * babel-plugin-transform-import-meta converts import.meta.env.X to process.env.X
 * so we set the Vite env vars on process.env here.
 */

process.env.VITE_USER_URL = 'http://localhost:8000/api/v1/user';
process.env.VITE_SELLER_URL = 'http://localhost:8000/api/v1/seller';
process.env.VITE_ADMIN_URL = 'http://localhost:8000/api/v1/admin';
process.env.VITE_PRODUCT_URL = 'http://localhost:8000/api/v1/product';
process.env.VITE_INDUSTRY_BASE = 'http://localhost:8000/api/v1/industry';
process.env.VITE_API_URL = 'http://localhost:8000';
