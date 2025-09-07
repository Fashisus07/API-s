import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProductCard({ product, onAddToCart }) {
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleAddToCart = async () => {
    if (!isAuthenticated()) {
      setMessage("Debes iniciar sesión para agregar productos al carrito");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    setLoading(true);
    try {
      // Simular agregado al carrito usando localStorage
      const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItem = existingCart.find(item => item.productId === product.id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        existingCart.push({
          id: Date.now(),
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          imageUrl: product.imageUrl,
          stock: product.stock
        });
      }
      
      localStorage.setItem('cart', JSON.stringify(existingCart));
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
          src={product.imageUrl || "https://via.placeholder.com/200x200?text=Producto"}
          alt={product.name}
          className="w-full h-48 object-cover rounded mb-2 border border-gray-200 hover:border-blue-300 transition-colors"
        />
        <h2 className="text-lg font-semibold mb-1 text-gray-800 hover:text-blue-600 transition-colors">{product.name}</h2>
        <p className="text-gray-600 mb-2 text-sm line-clamp-2">{product.description}</p>
        <p className="text-xs text-gray-500 mb-2">Stock: {product.stock}</p>
      </Link>
      <div className="flex justify-between items-center mt-auto">
        <span className="font-bold text-blue-600 text-lg">${product.price}</span>
        <button
          className="bg-blue-600 text-white font-semibold px-4 py-2 rounded shadow hover:bg-blue-700 disabled:opacity-50 transition-colors"
          onClick={handleAddToCart}
          disabled={product.stock === 0 || loading}
        >
          {loading ? "Agregando..." : product.stock === 0 ? "Sin stock" : "Agregar al carrito"}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
