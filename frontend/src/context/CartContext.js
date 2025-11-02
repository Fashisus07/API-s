// Importar React y hooks necesarios para el contexto del carrito de compras
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext"; // Importar contexto de autenticación para obtener datos del usuario

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
    // Si hay usuario autenticado, usar su email; si no, usar carrito de invitado
    return user?.email ? `cart_${user.email}` : 'cart_guest';
  };

  // useEffect que se ejecuta cuando cambia el usuario para cargar su carrito específico
  useEffect(() => {
    const cartKey = getCartKey(); // Obtener clave del carrito para el usuario actual
    const savedCart = localStorage.getItem(cartKey); // Buscar carrito guardado en localStorage

    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart)); // Parsear y cargar productos del carrito guardado
      } catch (error) {
        console.error('Error al cargar carrito:', error);
        localStorage.removeItem(cartKey); // Eliminar carrito corrupto
        setCartItems([]); // Resetear carrito si no hay datos guardados
      }
    } else {
      setCartItems([]); // Inicializar carrito vacío si no hay datos guardados
    }
    setLoading(false); // Finalizar estado de carga
  }, [user]); // Dependencia: se ejecuta cuando cambia el usuario

  // useEffect para guardar automáticamente el carrito en localStorage cuando cambie
  useEffect(() => {
    if (!loading) { // Solo guardar si no está en estado de carga
      const cartKey = getCartKey(); // Obtener clave del carrito
      localStorage.setItem(cartKey, JSON.stringify(cartItems)); // Guardar carrito serializado
    }
  }, [cartItems, loading, user]); // Dependencias: carrito, carga y usuario

  // Función para agregar un producto al carrito de compras
  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      // Buscar si el producto ya existe en el carrito
      const existingItem = prevItems.find(item => item.productId === product.id);

      if (existingItem) {
        // Si el producto ya existe, actualizar su cantidad respetando el stock
        return prevItems.map(item =>
          item.productId === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock || 99) }
            : item
        );
      } else {
        // Si es un producto nuevo, crear un nuevo item en el carrito
        const newItem = {
          id: Date.now(), // ID único para el item del carrito basado en timestamp
          productId: product.id, // ID del producto original
          name: product.name, // Nombre del producto
          price: product.price, // Precio del producto
          quantity: Math.min(quantity, product.stock || 99), // Cantidad respetando stock
          imageUrl: product.imageUrl || product.image, // URL de la imagen del producto
          stock: product.stock || 99, // Stock disponible del producto
          category: product.category // Categoría del producto
        };
        return [...prevItems, newItem]; // Agregar el nuevo item al array existente
      }
    });
  };

  // Función para actualizar la cantidad de un item específico en el carrito
  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return; // No permitir cantidades menores a 1

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId
          ? { ...item, quantity: Math.min(newQuantity, item.stock) } // Actualizar cantidad respetando stock
          : item // Mantener otros items sin cambios
      )
    );
  };

  // Función para remover completamente un item del carrito
  const removeFromCart = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId)); // Filtrar item por ID
  };

  // Función para vaciar completamente el carrito
  const clearCart = () => {
    setCartItems([]); // Resetear array de items
    // También limpiar el carrito del localStorage
    const cartKey = getCartKey();
    localStorage.removeItem(cartKey);
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
