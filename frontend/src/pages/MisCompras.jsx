// Importar React y hooks necesarios para el componente de historial de compras
import React, { useState, useEffect } from "react";
// Importar Link para navegación entre páginas
import { Link } from "react-router-dom";
// Importar contexto de autenticación para obtener datos del usuario
import { useAuth } from "../context/AuthContext";

// Componente MisCompras - Página para mostrar el historial de compras del usuario
function MisCompras() {
  // Obtener datos del usuario autenticado desde el contexto
  const { user } = useAuth();
  // Estado para almacenar la lista de pedidos del usuario
  const [orders, setOrders] = useState([]);
  // Estado para controlar el indicador de carga
  const [loading, setLoading] = useState(true);
  // Estado para controlar qué pedido tiene los detalles expandidos
  const [selectedOrder, setSelectedOrder] = useState(null);

  // useEffect para cargar pedidos cuando el componente se monta o cambia el usuario
  useEffect(() => {
    loadOrders();
  }, [user]);

  // Función para cargar los pedidos del usuario desde localStorage
  const loadOrders = () => {
    try {
      // Obtener pedidos del usuario desde localStorage usando su email como clave
      const userOrders = JSON.parse(localStorage.getItem(`orders_${user.email}`) || "[]");
      // Ordenar pedidos por fecha más reciente primero
      const sortedOrders = userOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      // Actualizar estado con pedidos ordenados
      setOrders(sortedOrders);
    } catch (error) {
      // En caso de error, mostrar en consola y establecer array vacío
      console.error("Error loading orders:", error);
      setOrders([]);
    } finally {
      // Siempre desactivar el indicador de carga al finalizar
      setLoading(false);
    }
  };

  // Función para formatear fechas en formato legible en español argentino
  const formatDate = (dateString) => {
    // Crear objeto Date desde string
    const date = new Date(dateString);
    // Retornar fecha formateada con configuración regional
    return date.toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Función para obtener clases CSS de color según el estado del pedido
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'; // Verde para confirmado
      case 'processing':
        return 'bg-yellow-100 text-yellow-800'; // Amarillo para procesando
      case 'shipped':
        return 'bg-blue-100 text-blue-800'; // Azul para enviado
      case 'delivered':
        return 'bg-purple-100 text-purple-800'; // Púrpura para entregado
      case 'cancelled':
        return 'bg-red-100 text-red-800'; // Rojo para cancelado
      default:
        return 'bg-gray-100 text-gray-800'; // Gris para estado desconocido
    }
  };

  // Función para obtener texto legible del estado del pedido
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

  // Función para obtener texto legible del método de pago
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
        return method; // Retornar método original si no se reconoce
    }
  };

  // Función para obtener texto legible del método de envío
  const getShippingMethodText = (method) => {
    switch (method) {
      case 'standard':
        return 'Envío estándar';
      case 'express':
        return 'Envío express';
      case 'same-day':
        return 'Envío mismo día';
      default:
        return method; // Retornar método original si no se reconoce
    }
  };

  // Si está cargando, mostrar indicador de carga
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          {/* Spinner de carga animado */}
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          {/* Texto de carga */}
          <p className="text-gray-600">Cargando tus compras...</p>
        </div>
      </div>
    );
  }

  return (
    // Contenedor principal con altura mínima de pantalla completa
    <div className="min-h-screen bg-gray-50">
      {/* Contenedor centrado con padding responsivo */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Sección de encabezado */}
        <div className="mb-8">
          {/* Título principal de la página */}
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Mis Compras</h1>
          {/* Descripción de la página */}
          <p className="text-gray-600">Historial de todas tus compras y pedidos</p>
        </div>

        {/* Condicional: mostrar mensaje si no hay pedidos o lista de pedidos */}
        {orders.length === 0 ? (
          // Estado vacío cuando no hay compras
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            {/* Emoji decorativo */}
            <div className="text-6xl mb-4">📦</div>
            {/* Título del estado vacío */}
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No tienes compras aún</h2>
            {/* Mensaje explicativo */}
            <p className="text-gray-600 mb-8">¡Explora nuestros productos y realiza tu primera compra!</p>
            {/* Botón para ir a explorar productos */}
            <Link
              to="/productos"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Explorar productos
            </Link>
          </div>
        ) : (
          // Lista de pedidos cuando existen compras
          <div className="space-y-6">
            {/* Mapear cada pedido para mostrar su información */}
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Encabezado del pedido con información básica */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    {/* Información del pedido (ID y fecha) */}
                    <div className="mb-4 md:mb-0">
                      <h3 className="text-lg font-bold text-gray-800">Pedido #{order.id}</h3>
                      <p className="text-gray-600">Realizado el {formatDate(order.createdAt)}</p>
                    </div>
                    {/* Estado y total del pedido */}
                    <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                      {/* Badge de estado con colores dinámicos */}
                      <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                      {/* Total del pedido */}
                      <span className="text-lg font-bold text-blue-600">${order.total}</span>
                    </div>
                  </div>
                </div>

                {/* Contenido detallado del pedido */}
                <div className="p-6">
                  {/* Sección de productos del pedido */}
                  <div className="mb-6">
                    {/* Título con contador de productos */}
                    <h4 className="font-semibold text-gray-800 mb-3">Productos ({order.items.length})</h4>
                    {/* Lista de productos con espaciado vertical */}
                    <div className="space-y-3">
                      {/* Mapear cada producto del pedido */}
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                          {/* Imagen del producto con fallback */}
                          <img
                            src={item.imageUrl || item.image}
                            alt={item.name}
                            className="w-15 h-15 object-cover rounded border"
                            onError={(e) => {
                              // Imagen por defecto si falla la carga
                              e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2UyZThmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTAiIGZpbGw9IiM2NDc0OGIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JTUc8L3RleHQ+PC9zdmc+";
                            }}
                          />
                          {/* Información del producto */}
                          <div className="flex-1">
                            {/* Nombre del producto como enlace clickeable */}
                            <Link
                              to={`/producto/${item.productId}`}
                              className="font-semibold text-gray-800 hover:text-blue-600"
                            >
                              {item.name}
                            </Link>
                            {/* Detalles de cantidad y precio unitario */}
                            <p className="text-gray-600 text-sm">
                              Cantidad: {item.quantity} | Precio unitario: ${item.price}
                            </p>
                          </div>
                          {/* Precio total del item */}
                          <div className="text-right">
                            <p className="font-bold">${item.price * item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Detalles del pedido en grid responsivo */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Información de envío */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                      {/* Título con emoji e icono */}
                      <h4 className="font-semibold text-blue-800 mb-3">📍 Información de Envío</h4>
                      {/* Detalles de envío */}
                      <div className="text-sm text-blue-700 space-y-1">
                        <p><strong>Método:</strong> {getShippingMethodText(order.shippingMethod)}</p>
                        <p><strong>Dirección:</strong> {order.customerInfo.address}</p>
                        <p><strong>Ciudad:</strong> {order.customerInfo.city}, {order.customerInfo.province}</p>
                        <p><strong>Código Postal:</strong> {order.customerInfo.postalCode}</p>
                        <p><strong>Teléfono:</strong> {order.customerInfo.phone}</p>
                      </div>
                    </div>

                    {/* Información de pago */}
                    <div className="bg-green-50 p-4 rounded-lg">
                      {/* Título con emoji e icono */}
                      <h4 className="font-semibold text-green-800 mb-3">💳 Información de Pago</h4>
                      {/* Detalles de pago */}
                      <div className="text-sm text-green-700 space-y-1">
                        <p><strong>Método:</strong> {getPaymentMethodText(order.paymentMethod)}</p>
                        <p><strong>Subtotal:</strong> ${order.subtotal}</p>
                        <p><strong>Envío:</strong> ${order.shippingPrice}</p>
                        <p><strong>Total:</strong> <span className="font-bold">${order.total}</span></p>
                      </div>
                    </div>
                  </div>

                  {/* Botones de acción del pedido */}
                  <div className="mt-6 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                    {/* Botón para expandir/contraer detalles */}
                    <button
                      onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                      className="flex-1 bg-gray-100 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      {selectedOrder === order.id ? 'Ocultar detalles' : 'Ver detalles completos'}
                    </button>
                    {/* Botón para comprar de nuevo */}
                    <Link
                      to="/productos"
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center"
                    >
                      Comprar de nuevo
                    </Link>
                    {/* Botón de cancelar (solo para pedidos confirmados) */}
                    {order.status === 'confirmed' && (
                      <button className="flex-1 bg-red-100 text-red-700 py-2 px-4 rounded-lg hover:bg-red-200 transition-colors">
                        Cancelar pedido
                      </button>
                    )}
                  </div>

                  {/* Detalles expandidos (mostrar solo si está seleccionado) */}
                  {selectedOrder === order.id && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      {/* Título de la sección expandida */}
                      <h4 className="font-semibold text-gray-800 mb-3">Detalles Completos del Pedido</h4>
                      {/* Grid con información adicional */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        {/* Columna izquierda */}
                        <div>
                          <p><strong>ID del Pedido:</strong> {order.id}</p>
                          <p><strong>Usuario:</strong> {order.userId}</p>
                          <p><strong>Nombre:</strong> {order.customerInfo.firstName} {order.customerInfo.lastName}</p>
                          <p><strong>Email:</strong> {order.customerInfo.email}</p>
                        </div>
                        {/* Columna derecha */}
                        <div>
                          <p><strong>Fecha de creación:</strong> {formatDate(order.createdAt)}</p>
                          <p><strong>Estado:</strong> {getStatusText(order.status)}</p>
                          <p><strong>Total de productos:</strong> {order.items.length}</p>
                          {/* Calcular cantidad total sumando todas las cantidades */}
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

        {/* Enlace para volver al inicio */}
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

// Exportar el componente para uso en otras partes de la aplicación
export default MisCompras;
