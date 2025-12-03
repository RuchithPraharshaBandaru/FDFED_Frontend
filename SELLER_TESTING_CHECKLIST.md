# Seller Portal Testing Checklist

## Pre-requisites
- [ ] Backend server running on `http://localhost:8000`
- [ ] Frontend dev server running (`npm run dev`)
- [ ] Browser has cookies enabled
- [ ] CORS properly configured on backend

## 1. Seller Registration

### Navigate to Signup
- [ ] Go to `http://localhost:5174/seller/signup`
- [ ] Page loads without errors
- [ ] All form fields are visible

### Fill Required Fields
- [ ] Enter Name
- [ ] Enter Email
- [ ] Enter Password
- [ ] Enter Store Name
- [ ] Enter GSTN
- [ ] Enter Phone Number
- [ ] Upload Profile Image
- [ ] Upload Aadhaar Image

### Optional Fields
- [ ] Enter Bank Account Number
- [ ] Enter IFSC Code
- [ ] Enter Bank Name
- [ ] Enter Street Address
- [ ] Enter City
- [ ] Enter State
- [ ] Enter PIN Code
- [ ] Enter Country

### Submit Form
- [ ] Click "Create Seller Account"
- [ ] No console errors
- [ ] Loading state shows
- [ ] Redirect to dashboard on success
- [ ] Error message shows if validation fails

## 2. Seller Login

### Navigate to Login
- [ ] Go to `http://localhost:5174/seller/login`
- [ ] Page loads correctly
- [ ] Form is visible

### Login Process
- [ ] Enter registered email
- [ ] Enter password
- [ ] Click "Sign In"
- [ ] Loading state displays
- [ ] Redirect to dashboard on success
- [ ] Error message for invalid credentials

### Session Persistence
- [ ] Refresh page
- [ ] User remains logged in
- [ ] Seller info visible in navbar

## 3. Dashboard

### Navigation
- [ ] Automatically redirected after login
- [ ] URL is `/seller/dashboard`
- [ ] Navbar displays correctly

### Statistics Cards
- [ ] Total Products count shows
- [ ] In Stock count shows
- [ ] Total Sales amount shows
- [ ] Total Orders count shows
- [ ] All numbers are accurate

### Quick Actions
- [ ] "Add New Product" button works
- [ ] "Manage Products" button works
- [ ] "View Orders" button works
- [ ] "Edit Profile" button works

### Recent Data
- [ ] Recent Products section shows (or empty state)
- [ ] Recent Sales section shows (or empty state)
- [ ] Data matches actual records

## 4. Create Product

### Navigate to Create
- [ ] Click "Add New Product" from dashboard
- [ ] Or navigate to `/seller/products/create`
- [ ] Form loads correctly

### Form Fields
- [ ] Product Title input works
- [ ] Price input accepts numbers
- [ ] Description textarea works
- [ ] Category dropdown shows options
- [ ] Quantity input works
- [ ] Stock checkbox toggles

### Image Upload
- [ ] Click upload area
- [ ] Select image file
- [ ] Preview displays
- [ ] Can change image

### Submit Product
- [ ] Fill all required fields
- [ ] Click "Create Product"
- [ ] Loading state shows
- [ ] Redirect to products list on success
- [ ] Validation errors show if fields missing

## 5. Products List

### Navigate to Products
- [ ] Go to `/seller/products`
- [ ] Page loads correctly

### Product Display
- [ ] All products show in grid
- [ ] Product images display
- [ ] Titles, prices show correctly
- [ ] Stock badges show correct status
- [ ] Category and quantity visible

### Actions
- [ ] Edit button navigates to edit page
- [ ] Delete button shows confirmation
- [ ] Delete removes product
- [ ] "Add New Product" button works

### Empty State
- [ ] If no products, empty state shows
- [ ] "Create Your First Product" button works

## 6. Edit Product

### Navigate to Edit
- [ ] Click "Edit" on a product
- [ ] URL is `/seller/products/edit/:id`
- [ ] Form pre-populates with product data

### Update Fields
- [ ] Change title
- [ ] Change price
- [ ] Change description
- [ ] Change category
- [ ] Change quantity
- [ ] Toggle stock status

### Submit Changes
- [ ] Click "Update Product"
- [ ] Loading state shows
- [ ] Redirect to products list
- [ ] Changes are saved
- [ ] Product list reflects updates

### Cancel
- [ ] Click "Cancel" button
- [ ] Redirects to products list
- [ ] No changes saved

## 7. Orders Page

### Navigate to Orders
- [ ] Go to `/seller/orders`
- [ ] Page loads correctly

### Statistics
- [ ] Total Orders shows
- [ ] Total Revenue calculates correctly
- [ ] Items Sold count is accurate

### Order Table
- [ ] All orders display
- [ ] Order ID shows
- [ ] Product name shows
- [ ] Customer name shows
- [ ] Quantity shows
- [ ] Amount shows
- [ ] Order date formats correctly
- [ ] Status badge shows with correct color

### Empty State
- [ ] If no orders, empty state shows
- [ ] Message is clear

## 8. Seller Profile

### Navigate to Profile
- [ ] Go to `/seller/profile`
- [ ] Form loads with current data

### Basic Information
- [ ] Name field shows current value
- [ ] Email field shows current value
- [ ] Store Name shows
- [ ] Phone Number shows

### Business Information
- [ ] GSTN field shows

### Address Information
- [ ] Street field shows
- [ ] City field shows
- [ ] State field shows
- [ ] PIN Code field shows
- [ ] Country field shows

### Update Profile
- [ ] Change any field
- [ ] Click "Update Profile"
- [ ] Success message shows
- [ ] Changes are saved
- [ ] Navbar updates if name changed

### Account Information
- [ ] Account ID displays
- [ ] Member Since date shows
- [ ] Information note is visible

## 9. Navigation & Navbar

### Navbar Elements
- [ ] Logo/Brand name shows
- [ ] "Dashboard" link works
- [ ] "Products" link works
- [ ] "Orders" link works
- [ ] "Profile" link works
- [ ] Active page highlighted

### Profile Dropdown
- [ ] Click user avatar/initial
- [ ] Dropdown menu opens
- [ ] Shows seller name and email
- [ ] "Your Profile" link works
- [ ] "Dashboard" link works
- [ ] "Sign out" button works

### Mobile View
- [ ] Hamburger menu shows on mobile
- [ ] Menu opens when clicked
- [ ] All links accessible
- [ ] Profile info shows
- [ ] Sign out works

## 10. Logout

### Logout Process
- [ ] Click "Sign out" from dropdown
- [ ] API call succeeds
- [ ] Redux state clears
- [ ] Redirect to login page
- [ ] Cannot access protected routes
- [ ] Navbar disappears

## 11. Protected Routes

### Access Control
- [ ] Logout completely
- [ ] Try to access `/seller/dashboard`
- [ ] Redirected to `/seller/login`
- [ ] Try `/seller/products`
- [ ] Redirected to login
- [ ] Try `/seller/orders`
- [ ] Redirected to login
- [ ] Try `/seller/profile`
- [ ] Redirected to login

### After Login
- [ ] Login again
- [ ] Can access dashboard
- [ ] Can access all protected routes
- [ ] Session persists on refresh

## 12. Error Handling

### Network Errors
- [ ] Stop backend server
- [ ] Try to login
- [ ] Error message shows
- [ ] Try to create product
- [ ] Error message shows
- [ ] App doesn't crash

### Validation Errors
- [ ] Submit empty login form
- [ ] Validation errors show
- [ ] Submit signup without files
- [ ] Error message shows
- [ ] Create product with negative price
- [ ] Validation prevents submission

### 404 Errors
- [ ] Try invalid product ID
- [ ] Error handled gracefully
- [ ] Navigate to non-existent route
- [ ] App handles properly

## 13. Redux State

### DevTools Check
- [ ] Open Redux DevTools
- [ ] Check seller slice exists
- [ ] Login updates state correctly
- [ ] Logout clears state
- [ ] Product fetch updates state
- [ ] Orders fetch updates state

### Persistence
- [ ] Login
- [ ] Refresh page
- [ ] Check Redux state persists
- [ ] Check localStorage for persist data

## 14. Performance

### Load Times
- [ ] Dashboard loads quickly
- [ ] Products page loads quickly
- [ ] Images load efficiently
- [ ] No unnecessary re-renders

### Optimization
- [ ] Check Network tab for duplicate requests
- [ ] Verify API calls are minimal
- [ ] Check for memory leaks

## 15. Browser Compatibility

### Tested Browsers
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if on Mac)

### Responsiveness
- [ ] Desktop view (1920x1080)
- [ ] Laptop view (1366x768)
- [ ] Tablet view (768x1024)
- [ ] Mobile view (375x667)

## 16. Integration with Buyer Portal

### Separate Portals
- [ ] Seller login doesn't affect buyer auth
- [ ] Buyer login doesn't affect seller auth
- [ ] Can be logged into both separately
- [ ] Different cookies/sessions

## Notes & Issues

Use this section to document any issues found:

---
**Issue**: 
**Steps to Reproduce**: 
**Expected**: 
**Actual**: 
**Priority**: 
---

## Sign-off

- [ ] All critical tests passed
- [ ] All features working as expected
- [ ] Documentation is accurate
- [ ] Code quality is good
- [ ] Ready for production

**Tester**: _______________
**Date**: _______________
**Version**: _______________
