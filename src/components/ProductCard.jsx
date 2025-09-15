import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

function ProductCard({ product, onAddToCart }) {
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      addToCart(product, 1);
      setMessage("¡Agregado al carrito!");
      setTimeout(() => setMessage(""), 2000);
      if (onAddToCart) onAddToCart(product);
    } catch (err) {
      setMessage("Error al agregar al carrito");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded shadow p-4 flex flex-col border border-blue-200 relative hover:shadow-lg transition-shadow">
      {message && (
        <div className={`absolute top-2 left-2 right-2 p-2 rounded text-sm text-center z-10 ${
          message.includes("Error") || message.includes("Debes") 
            ? "bg-red-100 text-red-700 border border-red-300" 
            : "bg-green-100 text-green-700 border border-green-300"
        }`}>
          {message}
        </div>
      )}
      <Link to={`/producto/${product.id}`} className="block">
        <img 
          src={product.imageUrl || product.image} 
          alt={product.name}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTJlOGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzY0NzQ4YiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlByb2R1Y3RvPC90ZXh0Pjwvc3ZnPg==";
          }}
        />
        <h2 className="text-lg font-semibold mb-1 text-gray-800 hover:text-blue-600 transition-colors">{product.name}</h2>
        <p className="text-gray-600 mb-2 text-sm line-clamp-2">{product.description}</p>
        <p className="text-xs text-gray-500 mb-2">Stock: {product.stock}</p>
      </Link>
      <div className="mt-4 space-y-2">
        <div className="flex justify-between items-center">
          <span className="font-bold text-blue-600 text-lg">${product.price}</span>
          <span className="text-sm text-gray-500">Stock: {product.stock}</span>
        </div>
        
        <div className="flex flex-col space-y-2">
          <button
            className="bg-blue-600 text-white font-semibold px-4 py-2 rounded shadow hover:bg-blue-700 disabled:opacity-50 transition-colors w-full"
            onClick={handleAddToCart}
            disabled={product.stock === 0 || loading}
          >
            {loading ? "Agregando..." : product.stock === 0 ? "Sin stock" : "Agregar al carrito"}
          </button>
          
          <Link 
            to={`/producto/${product.id}`}
            className="block text-center bg-green-600 text-white font-semibold px-4 py-2 rounded shadow hover:bg-green-700 transition-colors"
          >
            Comprar ahora
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
