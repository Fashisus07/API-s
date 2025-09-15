import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext.jsx';
import { CartContext } from './CartContext.jsx';

const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to get the cart key for the current user
  const getCartKey = () => {
    return user?.email ? `cart_${user.email}` : 'cart_guest';
  };

  // Load cart when user changes
  useEffect(() => {
    const cartKey = getCartKey();
    const savedCart = localStorage.getItem(cartKey);
    
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart:', error);
        localStorage.removeItem(cartKey);
        setCartItems([]);
      }
    } else {
      setCartItems([]);
    }
    setLoading(false);
  }, [user]);

  // Save cart to localStorage when it changes
  useEffect(() => {
    if (!loading) {
      const cartKey = getCartKey();
      localStorage.setItem(cartKey, JSON.stringify(cartItems));
    }
  }, [cartItems, loading, user]);

  // Add product to cart
  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.productId === product.id);
      
      if (existingItem) {
        // If product exists, update quantity
        return prevItems.map(item =>
          item.productId === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock || 99) }
            : item
        );
      } else {
        // If new, add it
        const newItem = {
          id: Date.now(), // Unique ID for cart item
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: Math.min(quantity, product.stock || 99),
          imageUrl: product.imageUrl || product.image,
          stock: product.stock || 99,
          category: product.category
        };
        return [...prevItems, newItem];
      }
    });
  };

  // Update item quantity
  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId
          ? { ...item, quantity: Math.min(newQuantity, item.stock) }
          : item
      )
    );
  };

  // Remove item from cart
  const removeFromCart = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
    // Also clear from localStorage
    const cartKey = getCartKey();
    localStorage.removeItem(cartKey);
  };

  // Get total number of items
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Get total price
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Check if a product is in the cart
  const isInCart = (productId) => {
    return cartItems.some(item => item.productId === productId);
  };

  // Get quantity of a specific product in the cart
  const getProductQuantity = (productId) => {
    const item = cartItems.find(item => item.productId === productId);
    return item ? item.quantity : 0;
  };

  const value = {
    cartItems,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalItems,
    getTotalPrice,
    isInCart,
    getProductQuantity
  };

  return (
    <CartContext.Provider value={value}>
      {!loading && children}
    </CartContext.Provider>
  );
};

export default CartProvider;
