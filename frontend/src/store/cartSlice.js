import { createSlice } from '@reduxjs/toolkit';

const cartItems = JSON.parse(localStorage.getItem('oppa_cart') || '[]');

const saveCart = (items) => localStorage.setItem('oppa_cart', JSON.stringify(items));

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: cartItems,
    isOpen: false,
  },
  reducers: {
    addToCart: (state, action) => {
      const { product, size, quantity = 1 } = action.payload;
      const key = `${product._id}-${size}`;
      const existing = state.items.find((i) => i.key === key);

      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({
          key,
          product: product._id,
          name: product.name,
          price: product.salePrice || product.price,
          image: product.images?.[0]?.url || '',
          gradient: product.gradient,
          size,
          quantity,
        });
      }
      saveCart(state.items);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((i) => i.key !== action.payload);
      saveCart(state.items);
    },
    updateQuantity: (state, action) => {
      const { key, quantity } = action.payload;
      const item = state.items.find((i) => i.key === key);
      if (item) {
        item.quantity = Math.max(1, quantity);
      }
      saveCart(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      saveCart([]);
    },
    openCart: (state) => { state.isOpen = true; },
    closeCart: (state) => { state.isOpen = false; },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, openCart, closeCart } = cartSlice.actions;

export const selectCartTotal = (state) =>
  state.cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

export const selectCartCount = (state) =>
  state.cart.items.reduce((sum, i) => sum + i.quantity, 0);

export default cartSlice.reducer;
