import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart') || '[]'));

  const saveCart = (items) => {
    setCart(items);
    localStorage.setItem('cart', JSON.stringify(items));
  };

  const addToCart = (product, quantity = 1) => {
    const existing = cart.find(i => i.product === product._id);
    if (existing) {
      saveCart(cart.map(i => i.product === product._id ? { ...i, quantity: i.quantity + quantity } : i));
    } else {
      saveCart([...cart, { product: product._id, name: product.name, price: product.price, image: product.image, quantity }]);
    }
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return removeFromCart(productId);
    saveCart(cart.map(i => i.product === productId ? { ...i, quantity } : i));
  };

  const removeFromCart = (productId) => saveCart(cart.filter(i => i.product !== productId));

  const clearCart = () => saveCart([]);

  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
