import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function MisCompras() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    loadOrders();
  }, [user]);

  const loadOrders = () => {
    try {
      const userOrders = JSON.parse(localStorage.getItem(`orders_${user.email}`) || "[]");
      // Ordenar por fecha más reciente primero
      const sortedOrders = userOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(sortedOrders);
    } catch (error) {
      console.error("Error loading orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-purple-100 text-purple-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmado';
      case 'processing':
        return 'Procesando';
      case 'shipped':
        return 'Enviado';
      case 'delivered':
        return 'Entregado';
      case 'cancelled':
        return 'Cancelado';
      default:
        return 'Desconocido';
    }
  };

  const getPaymentMethodText = (method) => {
    switch (method) {
      case 'credit-card':
        return 'Tarjeta de crédito';
      case 'debit-card':
        return 'Tarjeta de débito';
      case 'transfer':
        return 'Transferencia bancaria';
      case 'mercado-pago':
        return 'Mercado Pago';
      default:
        return method;
    }
  };

  const getShippingMethodText = (method) => {
    switch (method) {
      case 'standard':
        return 'Envío estándar';
      case 'express':
        return 'Envío express';
      case 'same-day':
        return 'Envío mismo día';
      default:
        return method;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando tus compras...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Mis Compras</h1>
          <p className="text-gray-600">Historial de todas tus compras y pedidos</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No tienes compras aún</h2>
            <p className="text-gray-600 mb-8">¡Explora nuestros productos y realiza tu primera compra!</p>
            <Link
              to="/productos"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Explorar productos
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="mb-4 md:mb-0">
                      <h3 className="text-lg font-bold text-gray-800">Pedido #{order.id}</h3>
                      <p className="text-gray-600">Realizado el {formatDate(order.createdAt)}</p>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                      <span className="text-lg font-bold text-blue-600">${order.total}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {/* Order Items */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-800 mb-3">Productos ({order.items.length})</h4>
                    <div className="space-y-3">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                          <img
                            src={item.imageUrl || item.image}
                            alt={item.name}
                            className="w-15 h-15 object-cover rounded border"
                            onError={(e) => {
                              e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2UyZThmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTAiIGZpbGw9IiM2NDc0OGIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JTUc8L3RleHQ+PC9zdmc+";
                            }}
                          />
                          <div className="flex-1">
                            <Link
                              to={`/producto/${item.productId}`}
                              className="font-semibold text-gray-800 hover:text-blue-600"
                            >
                              {item.name}
                            </Link>
                            <p className="text-gray-600 text-sm">
                              Cantidad: {item.quantity} | Precio unitario: ${item.price}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">${item.price * item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Shipping Info */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-3">📍 Información de Envío</h4>
                      <div className="text-sm text-blue-700 space-y-1">
                        <p><strong>Método:</strong> {getShippingMethodText(order.shippingMethod)}</p>
                        <p><strong>Dirección:</strong> {order.customerInfo.address}</p>
                        <p><strong>Ciudad:</strong> {order.customerInfo.city}, {order.customerInfo.province}</p>
                        <p><strong>Código Postal:</strong> {order.customerInfo.postalCode}</p>
                        <p><strong>Teléfono:</strong> {order.customerInfo.phone}</p>
                      </div>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-3">💳 Información de Pago</h4>
                      <div className="text-sm text-green-700 space-y-1">
                        <p><strong>Método:</strong> {getPaymentMethodText(order.paymentMethod)}</p>
                        <p><strong>Subtotal:</strong> ${order.subtotal}</p>
                        <p><strong>Envío:</strong> ${order.shippingPrice}</p>
                        <p><strong>Total:</strong> <span className="font-bold">${order.total}</span></p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                    <button
                      onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                      className="flex-1 bg-gray-100 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      {selectedOrder === order.id ? 'Ocultar detalles' : 'Ver detalles completos'}
                    </button>
                    <Link
                      to="/productos"
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center"
                    >
                      Comprar de nuevo
                    </Link>
                    {order.status === 'confirmed' && (
                      <button className="flex-1 bg-red-100 text-red-700 py-2 px-4 rounded-lg hover:bg-red-200 transition-colors">
                        Cancelar pedido
                      </button>
                    )}
                  </div>

                  {/* Expanded Details */}
                  {selectedOrder === order.id && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-3">Detalles Completos del Pedido</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p><strong>ID del Pedido:</strong> {order.id}</p>
                          <p><strong>Usuario:</strong> {order.userId}</p>
                          <p><strong>Nombre:</strong> {order.customerInfo.firstName} {order.customerInfo.lastName}</p>
                          <p><strong>Email:</strong> {order.customerInfo.email}</p>
                        </div>
                        <div>
                          <p><strong>Fecha de creación:</strong> {formatDate(order.createdAt)}</p>
                          <p><strong>Estado:</strong> {getStatusText(order.status)}</p>
                          <p><strong>Total de productos:</strong> {order.items.length}</p>
                          <p><strong>Cantidad total:</strong> {order.items.reduce((sum, item) => sum + item.quantity, 0)}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
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

export default MisCompras;
