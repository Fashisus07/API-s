// Importar React y hooks necesarios para el componente de tarjeta de producto
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Para navegación entre páginas
import { useAuth } from "../context/AuthContext"; // Contexto de autenticación
import { useCart } from "../context/CartContext"; // Contexto del carrito

// Componente ProductCard - Tarjeta individual para mostrar información de un producto
function ProductCard({ product, onAddToCart }) {
  const { isAuthenticated, user } = useAuth(); // Verificar si el usuario está autenticado y obtener datos del usuario
  const { addToCart } = useCart(); // Función para agregar productos al carrito
  const [loading, setLoading] = useState(false); // Estado para controlar la carga del botón
  const [message, setMessage] = useState(""); // Estado para mostrar mensajes de feedback
  const [isFavorite, setIsFavorite] = useState(false); // Estado para verificar si el producto está en favoritos

  // useEffect para verificar si el producto está en favoritos al cargar
  useEffect(() => {
    if (isAuthenticated() && user?.email) {
      const favorites = JSON.parse(localStorage.getItem(`favorites_${user.email}`) || '[]');
      setIsFavorite(favorites.some(fav => fav.id === product.id));
    }
  }, [product.id, user?.email, isAuthenticated]);

  // Función para manejar la adición de productos al carrito
  const handleAddToCart = async () => {
    setLoading(true); // Activar estado de carga
    try {
      addToCart(product, 1); // Agregar producto al carrito con cantidad 1
      setMessage("¡Agregado al carrito!"); // Mostrar mensaje de éxito
      setTimeout(() => setMessage(""), 2000); // Limpiar mensaje después de 2 segundos
      if (onAddToCart) onAddToCart(product); // Ejecutar callback opcional si se proporciona
    } catch (err) {
      setMessage("Error al agregar al carrito"); // Mostrar mensaje de error
      setTimeout(() => setMessage(""), 3000); // Limpiar mensaje después de 3 segundos
    } finally {
      setLoading(false); // Desactivar estado de carga
    }
  };

  // Función para manejar agregar/quitar de favoritos
  const handleToggleFavorite = () => {
    if (!isAuthenticated()) {
      setMessage("Debes iniciar sesión para agregar a favoritos");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    const favoritesKey = `favorites_${user.email}`;
    const favorites = JSON.parse(localStorage.getItem(favoritesKey) || '[]');

    if (isFavorite) {
      // Quitar de favoritos
      const updatedFavorites = favorites.filter(fav => fav.id !== product.id);
      localStorage.setItem(favoritesKey, JSON.stringify(updatedFavorites));
      setIsFavorite(false);
      setMessage("Eliminado de favoritos");
    } else {
      // Agregar a favoritos
      const updatedFavorites = [...favorites, product];
      localStorage.setItem(favoritesKey, JSON.stringify(updatedFavorites));
      setIsFavorite(true);
      setMessage("¡Agregado a favoritos!");
    }

    setTimeout(() => setMessage(""), 2000);
  };

  return (
    <div className="bg-white rounded shadow p-4 flex flex-col border border-blue-200 relative hover:shadow-lg transition-shadow">
      {/* Mensaje de feedback flotante - se muestra cuando hay un mensaje */}
      {message && (
        <div className={`absolute top-2 left-2 right-2 p-2 rounded text-sm text-center z-10 ${message.includes("Error") || message.includes("Debes")
            ? "bg-red-100 text-red-700 border border-red-300" // Estilo para mensajes de error
            : "bg-green-100 text-green-700 border border-green-300" // Estilo para mensajes de éxito
          }`}>
          {message}
        </div>
      )}

      {/* Botón de favoritos en la esquina superior derecha */}
      <button
        onClick={handleToggleFavorite}
        className={`absolute top-2 right-2 p-2 rounded-full transition-colors z-20 ${isFavorite
            ? "bg-red-100 text-red-600 hover:bg-red-200"
            : "bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-red-500"
          }`}
        title={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
      >
        {/* Icono de corazón */}
        <svg className="w-5 h-5" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>

      {/* Enlace que envuelve la información del producto para navegar al detalle */}
      <Link to={`/producto/${product.id}`} className="block">
        {/* Imagen del producto con fallback en caso de error */}
        <img
          src={product.imageUrl || product.image}
          alt={product.name}
          className="w-full h-48 object-cover"
          onError={(e) => {
            // Imagen por defecto en caso de error al cargar la imagen original
            e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTJlOGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzY0NzQ4YiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlByb2R1Y3RvPC90ZXh0Pjwvc3ZnPg==";
          }}
        />
        {/* Nombre del producto */}
        <h2 className="text-lg font-semibold mb-1 text-gray-800 hover:text-blue-600 transition-colors">{product.name}</h2>
        {/* Descripción del producto (limitada a 2 líneas) */}
        <p className="text-gray-600 mb-2 text-sm line-clamp-2">{product.description}</p>
        {/* Información del stock disponible */}
        <p className="text-xs text-gray-500 mb-2">Stock: {product.stock}</p>
      </Link>
      {/* Sección inferior con precio e información de envío */}
      <div className="mt-auto">
        {/* Precio del producto */}
        <div className="mb-2">
          <span className="font-bold text-blue-600 text-lg">${product.price.toLocaleString()}</span>
        </div>
        {/* Envío gratis para productos mayores a $25,000 */}
        {product.price > 25000 && (
          <div className="flex items-center text-green-600 text-sm font-medium">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Envío gratis
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductCard;
