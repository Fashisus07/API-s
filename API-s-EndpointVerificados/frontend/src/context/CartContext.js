// Importar React y hooks necesarios para el contexto del carrito de compras
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext"; // Importar contexto de autenticación para obtener datos del usuario
import { getCart, addToCart as apiAddToCart, updateCartItemById, removeCartItemById, clearCartBackend } from "../services/apiService";

// Crear el contexto del carrito que será compartido por toda la aplicación
const CartContext = createContext();

// Hook personalizado para acceder al contexto del carrito desde cualquier componente
export const useCart = () => {
  const context = useContext(CartContext); // Obtener el contexto actual
  if (!context) {
    // Lanzar error si el hook se usa fuera del CartProvider
    throw new Error("useCart debe ser usado dentro de CartProvider");
  }
  return context; // Retornar el contexto con todas las funciones y estados
};

// Componente proveedor que envuelve la aplicación y proporciona el estado del carrito
export const CartProvider = ({ children }) => {
  const { user } = useAuth(); // Obtener datos del usuario autenticado
  const [cartItems, setCartItems] = useState([]); // Estado para almacenar los productos del carrito
  const [loading, setLoading] = useState(true); // Estado para controlar la carga inicial

  // Función para generar la clave única del carrito basada en el usuario
  const getCartKey = () => {
    // Solo usuarios autenticados pueden tener carrito
    return user?.email ? `cart_${user.email}` : null;
  };

  // useEffect que se ejecuta cuando cambia el usuario para cargar su carrito específico
  useEffect(() => {
    // Limpiar carrito de invitado si existe
    localStorage.removeItem('cart_guest');
    
    // Si el usuario está autenticado, preferimos cargar el carrito desde el backend
    (async () => {
      try {
        const serverCart = await getCart();
        if (Array.isArray(serverCart) && serverCart.length > 0) {
          // Mapear CartItemDTO (id, productDTO, quantity) a la forma local usada por la UI
          const mapped = serverCart.map(ci => ({
            id: ci.id,
            productId: ci.product?.id || ci.productDTO?.id,
            name: ci.product?.name || ci.productDTO?.name,
            price: ci.product?.price || ci.productDTO?.price,
            quantity: ci.quantity,
            imageUrl: ci.product?.imageUrl || ci.productDTO?.imageUrl || ci.product?.image || ci.productDTO?.image,
            stock: ci.product?.stock || ci.productDTO?.stock || 0
          }));
          setCartItems(mapped);
        } else {
          setCartItems([]);
        }
      } catch (err) {
        // Si falla la carga desde backend (ej. no token válido), intentar fallback local
        const cartKey = getCartKey(); // Obtener clave del carrito para el usuario actual
        const savedCart = localStorage.getItem(cartKey); // Buscar carrito guardado en localStorage
        if (savedCart) {
          try {
            setCartItems(JSON.parse(savedCart));
          } catch (error) {
            console.error('Error al cargar carrito local:', error);
            localStorage.removeItem(cartKey);
            setCartItems([]);
          }
        } else {
          setCartItems([]);
        }
      }
    })();
    setLoading(false); // Finalizar estado de carga
  }, [user]); // Dependencia: se ejecuta cuando cambia el usuario

  // useEffect para guardar automáticamente el carrito en localStorage cuando cambie
  useEffect(() => {
    if (!loading) { // Solo guardar si no está en estado de carga
      const cartKey = getCartKey(); // Obtener clave del carrito
      if (cartKey) { // Solo guardar si hay usuario autenticado
        localStorage.setItem(cartKey, JSON.stringify(cartItems)); // Guardar carrito serializado
      }
    }
  }, [cartItems, loading, user]); // Dependencias: carrito, carga y usuario

  // Función para agregar un producto al carrito de compras
  const addToCart = async (product, quantity = 1) => {
    // Si el usuario está autenticado, intentar agregar en el backend
    if (user?.email) {
      try {
        const added = await apiAddToCart(product.id, quantity);
        // Mapear el CartItemDTO retornado al formato local y actualizar estado
        setCartItems(prev => {
          const idx = prev.findIndex(it => it.id === added.id || it.productId === (added.product?.id || added.productDTO?.id));
          const newItem = {
            id: added.id,
            productId: added.product?.id || added.productDTO?.id || product.id,
            name: added.product?.name || added.productDTO?.name || product.name,
            price: added.product?.price || added.productDTO?.price || product.price,
            quantity: added.quantity,
            imageUrl: added.product?.imageUrl || added.productDTO?.imageUrl || product.imageUrl || product.image,
            stock: added.product?.stock || added.productDTO?.stock || product.stock || 0
          };
          if (idx >= 0) {
            const copy = [...prev];
            copy[idx] = newItem;
            return copy;
          }
          return [...prev, newItem];
        });
        return;
      } catch (err) {
        console.error('Error agregando al carrito en backend, usando fallback local', err);
        // Si falla la llamada al backend, continuar con comportamiento local
      }
    }

    // Comportamiento local para usuarios no autenticados o si el backend falla
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.productId === product.id);

      if (existingItem) {
        return prevItems.map(item =>
          item.productId === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock || 99) }
            : item
        );
      } else {
        const newItem = {
          id: Date.now(),
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

  // Función para actualizar la cantidad de un item específico en el carrito
  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return; // No permitir cantidades menores a 1

    // Si el usuario está autenticado, intentar actualizar en backend
    if (user?.email) {
      try {
        const updated = await updateCartItemById(itemId, newQuantity);
        setCartItems(prev => prev.map(it => (it.id === updated.id || it.productId === (updated.product?.id || updated.productDTO?.id)) ? {
          id: updated.id,
          productId: updated.product?.id || updated.productDTO?.id,
          name: updated.product?.name || updated.productDTO?.name,
          price: updated.product?.price || updated.productDTO?.price,
          quantity: updated.quantity,
          imageUrl: updated.product?.imageUrl || updated.productDTO?.imageUrl,
          stock: updated.product?.stock || updated.productDTO?.stock || it.stock
        } : it));
        return;
      } catch (err) {
        console.error('Error actualizando carrito en backend, fallback local', err);
        // Continuar con fallback local
      }
    }

    // Fallback local
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId || item.productId === itemId
          ? { ...item, quantity: Math.min(newQuantity, item.stock) }
          : item
      )
    );
  };

  // Función para remover completamente un item del carrito
  const removeFromCart = async (itemId) => {
    // Intentar remover en backend si está autenticado
    if (user?.email) {
      try {
        await removeCartItemById(itemId);
        setCartItems(prev => prev.filter(item => !(item.id === itemId || item.productId === itemId)));
        return;
      } catch (err) {
        console.error('Error removiendo item en backend, fallback local', err);
        // Continuar con fallback local
      }
    }

    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId && item.productId !== itemId)); // Filtrar item por ID
  };

  // Función para vaciar completamente el carrito
  const clearCart = async () => {
    if (user?.email) {
      try {
        await clearCartBackend();
        setCartItems([]);
        return;
      } catch (err) {
        console.error('Error limpiando carrito en backend, fallback local', err);
        // Continuar con fallback local
      }
    }

    setCartItems([]); // Resetear array de items
    // También limpiar el carrito del localStorage
    const cartKey = getCartKey();
    if (cartKey) {
      localStorage.removeItem(cartKey);
    }
  };

  // Función para calcular la cantidad total de items en el carrito
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0); // Sumar todas las cantidades
  };

  // Función para calcular el precio total del carrito
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0); // Sumar precio * cantidad de cada item
  };

  // Función para verificar si un producto específico está en el carrito
  const isInCart = (productId) => {
    return cartItems.some(item => item.productId === productId); // Verificar existencia por ID de producto
  };

  // Función para obtener la cantidad de un producto específico en el carrito
  const getProductQuantity = (productId) => {
    const item = cartItems.find(item => item.productId === productId); // Buscar item por ID de producto
    return item ? item.quantity : 0; // Retornar cantidad o 0 si no existe
  };

  // Objeto con todos los valores y funciones que se proporcionarán a los componentes hijos
  const value = {
    cartItems, // Array de items del carrito
    loading, // Estado de carga
    addToCart, // Función para agregar productos
    updateQuantity, // Función para actualizar cantidades
    removeFromCart, // Función para remover items
    clearCart, // Función para vaciar carrito
    getTotalItems, // Función para obtener total de items
    getTotalPrice, // Función para obtener precio total
    isInCart, // Función para verificar si producto está en carrito
    getProductQuantity // Función para obtener cantidad de producto específico
  };

  // Proveedor del contexto que envuelve los componentes hijos
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
