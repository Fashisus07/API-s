import { createContext, useContext } from 'react';

const CartContext = createContext();

const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe ser usado dentro de CartProvider");
  }
  return context;
};

export { CartContext, useCart };
export default CartContext;
