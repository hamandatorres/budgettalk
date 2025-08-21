# Global Styling System Guide

## Overview

This project now uses CSS Custom Properties (CSS Variables) and utility classes for consistent, maintainable styling across all components.

## CSS Variables Available

### Colors

```css
--color-primary: #000000      /* Black */
--color-secondary: #ffffff    /* White */
--color-background: #ffffff   /* Background */
--color-text: #000000        /* Primary text */
--color-text-inverse: #ffffff /* Inverse text */
--color-border: #000000      /* Borders */
--color-shadow: #999999      /* Shadows */
--color-hover-bg: #f0f0f0    /* Hover backgrounds */
```

### Typography

```css
--font-primary: "Press Start 2P", cursive    /* Pixel font */
--font-secondary: system fonts               /* Regular font */
--font-size-xs: 8px
--font-size-sm: 10px
--font-size-md: 12px
--font-size-lg: 16px
--font-size-xl: 20px
--font-size-xxl: 24px
--font-size-title: 28px
```

### Spacing

```css
--spacing-xs: 4px
--spacing-sm: 8px
--spacing-md: 15px
--spacing-lg: 20px
--spacing-xl: 30px
```

## Utility Classes

### Typography

- `.text-primary` - Uses pixel font (Press Start 2P)
- `.text-secondary` - Uses system font
- `.text-xs` through `.text-title` - Font sizes
- `.text-center`, `.text-left`, `.text-right` - Text alignment

### Colors

- `.color-primary`, `.color-secondary` - Text colors
- `.bg-primary`, `.bg-secondary` - Background colors

### Buttons

- `.btn` - Base button class
- `.btn-primary` - Black button with white text
- `.btn-secondary` - White button with black text

### Layout

- `.container` - Standard container with border and shadow
- `.p-xs` through `.p-xl` - Padding utilities
- `.m-xs` through `.m-xl` - Margin utilities

## How to Make Global Changes

### Change Color Scheme

To switch from black/white to another color scheme, just update the CSS variables in `src/index.css`:

```css
:root {
	--color-primary: #your-primary-color;
	--color-secondary: #your-secondary-color;
	/* etc... */
}
```

### Change Font

To switch fonts globally:

```css
:root {
	--font-primary: "Your New Font", cursive;
}
```

### Change Font Sizes

To adjust all font sizes proportionally:

```css
:root {
	--font-size-xs: 10px; /* Was 8px */
	--font-size-sm: 12px; /* Was 10px */
	/* etc... */
}
```

## Refactoring Components

### Before (Manual CSS):

```css
.my-component {
	font-family: "Press Start 2P", cursive;
	font-size: 10px;
	color: black;
	background: white;
	padding: 15px;
}
```

### After (Using Variables):

```css
.my-component {
	font-family: var(--font-primary);
	font-size: var(--font-size-sm);
	color: var(--color-text);
	background: var(--color-background);
	padding: var(--spacing-md);
}
```

### Or Using Utility Classes:

```jsx
<div className="text-primary text-sm color-text bg-secondary p-md">Content</div>
```

## Benefits

1. **Single Source of Truth**: Change colors/fonts in one place
2. **Consistency**: All components use the same values
3. **Maintainability**: Easy to update the entire theme
4. **Performance**: No duplicate CSS rules
5. **Flexibility**: Mix variables with custom CSS as needed

## Migration Strategy

You can gradually migrate components:

1. Start with the most frequently changed properties (colors, fonts)
2. Replace hard-coded values with CSS variables
3. Optionally add utility classes for common patterns
4. Test each component after migration

## Example: Changing to Blue Theme

Just update these variables:

```css
:root {
	--color-primary: #1e40af; /* Blue */
	--color-secondary: #eff6ff; /* Light blue */
	--color-text: #1e40af; /* Blue text */
	--color-border: #1e40af; /* Blue borders */
}
```

All components using these variables will automatically update!
