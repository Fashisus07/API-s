import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

function Carrito() {
  const { isAuthenticated, user } = useAuth();
  const { cartItems, loading, updateQuantity, removeFromCart, clearCart, getTotalPrice } = useCart();
  const navigate = useNavigate();
  const [updating, setUpdating] = useState(false);
  const [removing, setRemoving] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login", { state: { from: "/carrito" } });
    }
  }, [isAuthenticated, navigate]);

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setUpdating(true);
    try {
      await updateQuantity(productId, newQuantity);
      showMessage("Cantidad actualizada", "success");
    } catch (error) {
      console.error("Error al actualizar la cantidad:", error);
      showMessage("Error al actualizar la cantidad", "error");
    } finally {
      setUpdating(false);
    }
  };

  const handleRemoveItem = async (productId) => {
    setRemoving(productId);
    try {
      await removeFromCart(productId);
      showMessage("Producto eliminado del carrito", "success");
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      showMessage("Error al eliminar el producto", "error");
    } finally {
      setRemoving(null);
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      showMessage("El carrito está vacío", "error");
      return;
    }
    setIsCheckingOut(true);
    navigate("/checkout");
  };

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando carrito...</p>
        </div>
      </div>
    );
  }

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = getTotalPrice();
  const shipping = subtotal > 0 ? 500 : 0; // Ejemplo de envío fijo
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Carrito de Compras</h1>
          <Link
            to="/productos"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Seguir comprando
          </Link>
        </div>

        {message && (
          <div
            className={`mb-6 p-4 rounded-md ${
              messageType === "error"
                ? "bg-red-100 text-red-700 border border-red-200"
                : "bg-green-100 text-green-700 border border-green-200"
            }`}
          >
            {message}
          </div>
        )}

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h2 className="mt-4 text-lg font-medium text-gray-900">Tu carrito está vacío</h2>
            <p className="mt-1 text-gray-500">
              Parece que aún no has agregado ningún producto a tu carrito.
            </p>
            <div className="mt-6">
              <Link
                to="/productos"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Ver productos
              </Link>
            </div>
          </div>
        ) : (
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            {/* Lista de productos */}
            <div className="lg:col-span-2">
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <ul className="divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <li key={item.id} className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row">
                        <div className="flex-shrink-0 w-32 h-32 bg-gray-100 rounded-md overflow-hidden">
                          <img
                            src={item.imageUrl || item.image || "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTJlOGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzY0NzQ4YiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlByb2R1Y3RvPC90ZXh0Pjwvc3ZnPg=="}
                            alt={item.name}
                            className="w-full h-full object-cover object-center"
                            onError={(e) => {
                              e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTJlOGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzY0NzQ4YiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlByb2R1Y3RvPC90ZXh0Pjwvc3ZnPg==";
                            }}
                          />
                        </div>

                        <div className="mt-4 sm:mt-0 sm:ml-6 flex-1">
                          <div className="flex flex-col h-full">
                            <div className="flex-1">
                              <h3 className="text-lg font-medium text-gray-900">
                                {item.name}
                              </h3>
                              <p className="mt-1 text-sm text-gray-500">
                                {item.category}
                              </p>
                              <p className="mt-1 text-sm font-medium text-blue-600">
                                ${item.price.toFixed(2)}
                                <span className="text-gray-500 text-xs ml-1">c/u</span>
                              </p>
                              <p className="mt-1 text-sm text-gray-700">
                                Subtotal: <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                              </p>
                            </div>

                            <div className="mt-4 flex items-center justify-between">
                              <div className="flex items-center">
                                <button
                                  onClick={() =>
                                    handleQuantityChange(item.id, item.quantity - 1)
                                  }
                                  disabled={updating || item.quantity <= 1}
                                  className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                                >
                                  <svg
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M20 12H4"
                                    />
                                  </svg>
                                </button>
                                <span className="mx-2 text-gray-700 w-8 text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    handleQuantityChange(item.id, item.quantity + 1)
                                  }
                                  disabled={updating}
                                  className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                                >
                                  <svg
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 4v16m8-8H4"
                                    />
                                  </svg>
                                </button>
                              </div>
                              <button
                                onClick={() => handleRemoveItem(item.id)}
                                disabled={removing === item.id}
                                className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
                              >
                                {removing === item.id ? "Eliminando..." : "Eliminar"}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-gray-200 px-4 py-4 sm:px-6">
                  <button
                    onClick={clearCart}
                    disabled={cartItems.length === 0 || updating}
                    className="text-sm text-red-600 hover:text-red-800 font-medium disabled:opacity-50"
                  >
                    Vaciar carrito
                  </button>
                </div>
              </div>
            </div>

            {/* Resumen de la orden */}
            <div className="mt-8 lg:mt-0">
              <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">
                  Resumen de la orden
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span>
                      {totalItems} {totalItems === 1 ? "producto" : "productos"}
                    </span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Envío</span>
                    <span className="font-medium">
                      {shipping > 0 ? `$${shipping.toFixed(2)}` : "Gratis"}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total</span>
                      <span className="text-blue-600">${total.toFixed(2)}</span>
                    </div>
                    {shipping > 0 && (
                      <p className="text-xs text-green-600 mt-1 text-right">
                        ¡Envío gratuito en compras superiores a $25.000!
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={handleCheckout}
                    disabled={cartItems.length === 0 || isCheckingOut}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isCheckingOut ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Procesando...
                      </>
                    ) : (
                      "Proceder al pago"
                    )}
                  </button>
                  
                  <Link
                    to="/productos"
                    className="block w-full text-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    Seguir comprando
                  </Link>
                </div>

                <p className="mt-4 text-center text-sm text-gray-500">
                  O{' '}
                  <Link
                    to="/productos"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    continuar comprando
                  </Link>
                </p>
              </div>

              <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-lg p-6">
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  ¿Necesitas ayuda?
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Si tienes alguna pregunta o necesitas asistencia con tu pedido, no dudes en contactarnos.
                </p>
                <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-200">
                  Contactar con soporte
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Carrito;
