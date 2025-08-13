import React, { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

function Cart() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState({});
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const res = await api.get("/cart");
      setItems(res.data);
      setError("");
    } catch (err) {
      setError("Error al cargar el carrito");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setUpdating(prev => ({ ...prev, [itemId]: true }));
    try {
      await api.put(`/cart/update/${itemId}`, { quantity: newQuantity });
      
      setItems(prev => prev.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ));
      setMessage("Cantidad actualizada");
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      setMessage(err.response?.data?.error || "Error al actualizar cantidad");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setUpdating(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const removeItem = async (itemId) => {
    setUpdating(prev => ({ ...prev, [itemId]: true }));
    try {
      await api.delete(`/cart/remove/${itemId}`);
      
      setItems(prev => prev.filter(item => item.id !== itemId));
      setMessage("Producto eliminado del carrito");
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      setMessage(err.response?.data?.error || "Error al eliminar producto");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setUpdating(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const clearCart = async () => {
    if (!window.confirm("¿Estás seguro de que quieres vaciar el carrito?")) return;
    
    setLoading(true);
    try {
      await api.delete("/cart/clear");
      
      setItems([]);
      setMessage("Carrito vaciado");
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      setMessage(err.response?.data?.error || "Error al vaciar carrito");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const checkout = async () => {
    if (!window.confirm("¿Confirmar compra?")) return;
    
    setCheckoutLoading(true);
    try {
      const res = await api.post("/cart/checkout");
      
      setItems([]);
      setMessage(`¡Compra exitosa! Total: $${res.data.total}`);
      setTimeout(() => {
        setMessage("");
        navigate("/products");
      }, 3000);
    } catch (err) {
      setMessage(err.response?.data?.error || "Error al procesar compra");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setCheckoutLoading(false);
    }
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      return total + (item.product?.price || 0) * item.quantity;
    }, 0).toFixed(2);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto mt-8 bg-white p-8 rounded shadow border border-primary/30">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-secondary">Cargando carrito...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-8">
      {message && (
        <div className={`mb-4 p-4 rounded border text-center ${
          message.includes("Error") 
            ? "bg-red-100 text-red-700 border-red-300" 
            : "bg-green-100 text-green-700 border-green-300"
        }`}>
          {message}
        </div>
      )}
      
      <div className="bg-white p-8 rounded shadow border border-primary/30">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-accent">Carrito de compras</h1>
          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="text-red-600 hover:text-red-800 font-medium"
            >
              Vaciar carrito
            </button>
          )}
        </div>
        
        {error ? (
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={fetchCart}
              className="bg-primary text-secondary px-4 py-2 rounded hover:bg-primary-dark"
            >
              Reintentar
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-xl font-semibold text-secondary mb-2">Tu carrito está vacío</h2>
            <p className="text-gray-600 mb-6">¡Agrega productos para comenzar a comprar!</p>
            <button 
              onClick={() => navigate("/products")}
              className="bg-primary text-secondary px-6 py-3 rounded hover:bg-primary-dark font-semibold"
            >
              Ver productos
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 border border-primary/20 rounded">
                  <img
                    src={item.product?.imageUrl || "https://via.placeholder.com/80x80?text=Producto"}
                    alt={item.product?.name}
                    className="w-20 h-20 object-cover rounded border"
                  />
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-secondary">{item.product?.name}</h3>
                    <p className="text-sm text-gray-600">{item.product?.description}</p>
                    <p className="text-lg font-bold text-accent">${item.product?.price}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1 || updating[item.id]}
                      className="w-8 h-8 rounded border border-primary/40 hover:bg-primary/10 disabled:opacity-50"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={updating[item.id]}
                      className="w-8 h-8 rounded border border-primary/40 hover:bg-primary/10 disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-bold text-lg">${((item.product?.price || 0) * item.quantity).toFixed(2)}</p>
                    <button
                      onClick={() => removeItem(item.id)}
                      disabled={updating[item.id]}
                      className="text-red-600 hover:text-red-800 text-sm disabled:opacity-50"
                    >
                      {updating[item.id] ? "Eliminando..." : "Eliminar"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-primary/20 pt-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <p className="text-lg text-secondary">Total ({items.length} {items.length === 1 ? 'producto' : 'productos'}):</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-accent">${calculateTotal()}</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={() => navigate("/products")}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded hover:bg-gray-300 font-semibold"
                >
                  Seguir comprando
                </button>
                <button
                  onClick={checkout}
                  disabled={checkoutLoading}
                  className="flex-1 bg-primary text-secondary py-3 rounded hover:bg-primary-dark font-semibold disabled:opacity-50"
                >
                  {checkoutLoading ? "Procesando..." : "Finalizar compra"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Cart;
