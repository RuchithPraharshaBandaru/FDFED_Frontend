# Reusable UI Components Documentation

This project includes a set of reusable UI components to maintain consistency and reduce code duplication across the application.

## Available Components

### 1. Input Component
**Location:** `src/components/ui/Input.jsx`

**Usage:**
```jsx
import Input from '../ui/Input';

<Input
  label="Email"
  type="email"
  name="email"
  value={formData.email}
  onChange={handleChange}
  placeholder="Enter your email"
  required
/>
```

**Props:**
- `label` (string): Label text displayed above input
- `type` (string): Input type (text, email, password, etc.) - default: 'text'
- `name` (string): Input name attribute
- `id` (string): Input id (auto-generated from name if not provided)
- `value` (string): Input value
- `onChange` (function): Change handler
- `placeholder` (string): Placeholder text
- `required` (boolean): Whether field is required - default: false
- `className` (string): Additional classes for wrapper div
- `...props`: Any other input attributes

**Features:**
- Automatic dark mode styling
- Consistent focus states
- Automatic label-input association

---

### 2. Select Component
**Location:** `src/components/ui/Select.jsx`

**Usage:**
```jsx
import Select from '../ui/Select';

<Select
  label="Size"
  name="size"
  value={formData.size}
  onChange={handleChange}
  options={['S', 'M', 'L', 'XL']}
  placeholder="Select size"
  required
/>

// Or with object options:
<Select
  label="Country"
  name="country"
  value={formData.country}
  onChange={handleChange}
  options={[
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' }
  ]}
/>
```

**Props:**
- `label` (string): Label text
- `name` (string): Select name attribute
- `id` (string): Select id (auto-generated from name if not provided)
- `value` (string): Selected value
- `onChange` (function): Change handler
- `options` (array): Array of strings or objects with value/label
- `placeholder` (string): Placeholder option text - default: 'Select an option'
- `required` (boolean): Whether field is required - default: false
- `className` (string): Additional classes for wrapper div

---

### 3. Button Component
**Location:** `src/components/ui/Button.jsx`

**Usage:**
```jsx
import Button from '../ui/Button';

<Button type="submit" variant="primary" size="md">
  Save Changes
</Button>

<Button variant="secondary" onClick={handleCancel}>
  Cancel
</Button>

<Button variant="outline" fullWidth>
  Full Width Button
</Button>
```

**Props:**
- `children` (ReactNode): Button content
- `type` (string): Button type - default: 'button'
- `variant` (string): Button style variant - default: 'primary'
  - `primary`: Green background
  - `secondary`: Gray background
  - `outline`: Border only
  - `ghost`: Text only
  - `danger`: Red background
- `size` (string): Button size - default: 'md'
  - `sm`: Small
  - `md`: Medium
  - `lg`: Large
- `fullWidth` (boolean): Makes button full width - default: false
- `disabled` (boolean): Disabled state - default: false
- `onClick` (function): Click handler
- `className` (string): Additional classes

---

### 4. Textarea Component
**Location:** `src/components/ui/Textarea.jsx`

**Usage:**
```jsx
import Textarea from '../ui/Textarea';

<Textarea
  label="Description"
  name="description"
  value={formData.description}
  onChange={handleChange}
  placeholder="Enter description"
  rows={4}
/>
```

**Props:**
- `label` (string): Label text
- `name` (string): Textarea name attribute
- `id` (string): Textarea id (auto-generated from name if not provided)
- `value` (string): Textarea value
- `onChange` (function): Change handler
- `placeholder` (string): Placeholder text
- `rows` (number): Number of rows - default: 4
- `required` (boolean): Whether field is required - default: false
- `className` (string): Additional classes for wrapper div

---

### 5. Card Component
**Location:** `src/components/ui/Card.jsx`

**Usage:**
```jsx
import Card from '../ui/Card';

<Card padding="default">
  <h2>Card Title</h2>
  <p>Card content goes here</p>
</Card>

<Card padding="lg" className="mt-4">
  Custom card with larger padding
</Card>
```

**Props:**
- `children` (ReactNode): Card content
- `padding` (string): Padding size - default: 'default'
  - `none`: No padding
  - `sm`: Small padding (p-4)
  - `default`: Default padding (p-6)
  - `lg`: Large padding (p-8)
- `className` (string): Additional classes

**Features:**
- Automatic dark mode styling
- Shadow and border styling
- Rounded corners

---

### 6. Alert Component
**Location:** `src/components/ui/Alert.jsx`

**Usage:**
```jsx
import Alert from '../ui/Alert';

<Alert type="success" message="Profile updated successfully!" />
<Alert type="error" message={errorMessage} />
<Alert type="warning" message="Warning message" />
<Alert type="info" message="Information message" />
```

**Props:**
- `type` (string): Alert type - default: 'info'
  - `success`: Green with checkmark icon
  - `error`: Red with X icon
  - `warning`: Yellow with alert icon
  - `info`: Blue with info icon
- `message` (string): Alert message (returns null if empty)
- `className` (string): Additional classes

**Features:**
- Automatic icon based on type
- Dark mode support
- Auto-hides when message is empty

---

## Benefits of Using These Components

1. **Consistency**: All forms and UI elements look the same throughout the app
2. **Dark Mode**: Built-in dark mode support - no need to add dark classes manually
3. **Less Code**: Reduce repetitive HTML/CSS by 70%+
4. **Maintainability**: Update styling in one place instead of 20+ files
5. **Accessibility**: Proper label-input associations and ARIA attributes
6. **Type Safety**: Easier to catch prop mistakes

## Migration Example

**Before:**
```jsx
<div>
  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
    Email
  </label>
  <input
    type="email"
    name="email"
    id="email"
    value={formData.email}
    onChange={handleChange}
    className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
  />
</div>
```

**After:**
```jsx
<Input
  label="Email"
  type="email"
  name="email"
  value={formData.email}
  onChange={handleChange}
/>
```

**Code reduction:** 10 lines → 6 lines (40% reduction)

## Pages Already Refactored

- ✅ `AccountPage.jsx` - Uses Input, Button, Alert
- ✅ `AccountAddressPage.jsx` - Uses Input, Button, Alert

## Pages That Can Be Refactored

- `SellPage.jsx` - Can use Input, Select, Textarea, Button, Alert, Card
- `CheckoutPage.jsx` - Can use Input, Button, Card
- `LoginPage.jsx` - Can use Input, Button, Alert
- `SignupPage.jsx` - Can use Input, Button, Alert
- `AboutusPage.jsx` - Can use Input, Textarea, Button

## Next Steps

Continue refactoring other pages to use these components for better code organization and maintainability.
