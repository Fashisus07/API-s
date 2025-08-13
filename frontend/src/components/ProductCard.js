import React, { useState } from "react";
import api from "../api";
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
      await api.post("/cart/add", {
        productId: product.id,
        quantity: 1,
      });
      setMessage("¡Agregado al carrito!");
      setTimeout(() => setMessage(""), 2000);
      if (onAddToCart) onAddToCart(product);
    } catch (err) {
      setMessage(err.response?.data?.error || "Error al agregar al carrito");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded shadow p-4 flex flex-col border border-primary/40 relative">
      {message && (
        <div className={`absolute top-2 left-2 right-2 p-2 rounded text-sm text-center ${
          message.includes("Error") || message.includes("Debes") 
            ? "bg-red-100 text-red-700 border border-red-300" 
            : "bg-green-100 text-green-700 border border-green-300"
        }`}>
          {message}
        </div>
      )}
      <img
        src={product.imageUrl || "https://via.placeholder.com/200x200?text=Producto"}
        alt={product.name}
        className="w-full h-48 object-cover rounded mb-2 border border-primary"
      />
      <h2 className="text-lg font-semibold mb-1 text-secondary">{product.name}</h2>
      <p className="text-gray-700 mb-2 text-sm">{product.description}</p>
      <p className="text-xs text-gray-500 mb-2">Stock: {product.stock}</p>
      <div className="flex justify-between items-center mt-auto">
        <span className="font-bold text-accent text-lg">${product.price}</span>
        <button
          className="bg-primary text-secondary font-semibold px-4 py-2 rounded shadow hover:bg-primary-dark disabled:opacity-50 border border-secondary transition-colors"
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
