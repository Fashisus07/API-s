import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Carrito() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }

    const fetchCartItems = async () => {
      try {
        // Simular datos del carrito desde localStorage
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          const cartData = JSON.parse(savedCart);
          setCartItems(cartData);
        } else {
          // Datos de ejemplo para demostración
          const exampleCart = [
            {
              id: 1,
              productId: 1,
              name: "iPhone 14 Pro",
              price: 999999,
              quantity: 1,
              imageUrl: "https://via.placeholder.com/100x100?text=iPhone",
              stock: 10
            },
            {
              id: 2,
              productId: 3,
              name: "Auriculares Bluetooth",
              price: 15000,
              quantity: 2,
              imageUrl: "https://via.placeholder.com/100x100?text=Auriculares",
              stock: 25
            }
          ];
          setCartItems(exampleCart);
          localStorage.setItem('cart', JSON.stringify(exampleCart));
        }
      } catch (err) {
        console.error("Error al cargar el carrito:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [isAuthenticated, navigate]);

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    setUpdating(true);
    try {
      const updatedItems = cartItems.map(item =>
        item.id === itemId
          ? { ...item, quantity: Math.min(newQuantity, item.stock) }
          : item
      );
      setCartItems(updatedItems);
      localStorage.setItem('cart', JSON.stringify(updatedItems));
      setMessage("Cantidad actualizada");
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      setMessage("Error al actualizar cantidad");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setUpdating(false);
    }
  };

  const removeItem = async (itemId) => {
    setUpdating(true);
    try {
      const updatedItems = cartItems.filter(item => item.id !== itemId);
      setCartItems(updatedItems);
      localStorage.setItem('cart', JSON.stringify(updatedItems));
      setMessage("Producto eliminado del carrito");
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      setMessage("Error al eliminar producto");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setUpdating(false);
    }
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
    setMessage("Carrito vaciado");
    setTimeout(() => setMessage(""), 2000);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      setMessage("Tu carrito está vacío");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    // Simular proceso de checkout
    setMessage("Redirigiendo al checkout...");
    setTimeout(() => {
      alert("¡Compra realizada con éxito! (Esta es una simulación)");
      clearCart();
    }, 1500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando carrito...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Mi Carrito</h1>
          <p className="text-gray-600">Revisa tus productos antes de finalizar la compra</p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.includes("Error")
              ? "bg-red-100 text-red-700 border border-red-300"
              : "bg-green-100 text-green-700 border border-green-300"
            }`}>
            {message}
          </div>
        )}

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Tu carrito está vacío</h2>
            <p className="text-gray-600 mb-8">¡Descubre nuestros productos y agrega algunos a tu carrito!</p>
            <Link
              to="/productos"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Explorar productos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">
                      Productos ({cartItems.length})
                    </h2>
                    <button
                      onClick={clearCart}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Vaciar carrito
                    </button>
                  </div>
                </div>

                <div className="divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <div key={item.id} className="p-6">
                      <div className="flex items-center space-x-4">
                        <img
                          src={item.imageUrl || "https://via.placeholder.com/80x80?text=Producto"}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded border border-gray-200"
                        />

                        <div className="flex-1">
                          <Link
                            to={`/producto/${item.productId}`}
                            className="text-lg font-semibold text-gray-800 hover:text-blue-600"
                          >
                            {item.name}
                          </Link>
                          <p className="text-gray-600">${item.price} c/u</p>
                          <p className="text-sm text-gray-500">Stock: {item.stock}</p>
                        </div>

                        <div className="flex items-center space-x-3">
                          <div className="flex items-center border border-gray-300 rounded">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={updating || item.quantity <= 1}
                              className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50"
                            >
                              -
                            </button>
                            <span className="px-3 py-1 border-x border-gray-300">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={updating || item.quantity >= item.stock}
                              className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50"
                            >
                              +
                            </button>
                          </div>

                          <span className="font-bold text-lg text-blue-600 w-24 text-right">
                            ${item.price * item.quantity}
                          </span>

                          <button
                            onClick={() => removeItem(item.id)}
                            disabled={updating}
                            className="text-red-600 hover:text-red-800 p-2 disabled:opacity-50"
                            title="Eliminar producto"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Resumen del pedido</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-semibold">${calculateTotal()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Envío:</span>
                    <span className="font-semibold text-green-600">Gratis</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-blue-600">${calculateTotal()}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={cartItems.length === 0 || updating}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-4"
                >
                  Finalizar compra
                </button>

                <Link
                  to="/productos"
                  className="block w-full text-center bg-gray-100 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  Seguir comprando
                </Link>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">🔒 Compra protegida</h3>
                  <p className="text-sm text-blue-700">
                    Tus datos están seguros. Garantía de devolución si no estás satisfecho.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Carrito;
