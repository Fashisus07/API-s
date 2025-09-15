import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function MisCompras() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Simular carga de órdenes
  useEffect(() => {
    const loadOrders = async () => {
      try {
        // Simular carga de datos
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Obtener órdenes del localStorage (simulando una API)
        const savedOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
        
        // Si no hay órdenes, crear algunas de ejemplo
        if (savedOrders.length === 0) {
          const sampleOrders = [
            {
              id: 1,
              orderNumber: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
              date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
              status: "completed",
              items: [
                { id: 101, name: "Producto de ejemplo 1", price: 29.99, quantity: 2, image: "" },
                { id: 102, name: "Producto de ejemplo 2", price: 49.99, quantity: 1, image: "" }
              ],
              subtotal: 109.97,
              shipping: 5.99,
              tax: 23.09,
              total: 139.05,
              shippingAddress: {
                name: `${user?.firstName || 'Usuario'} ${user?.lastName || 'Ejemplo'}`,
                address: "Av. Siempre Viva 123",
                city: "Buenos Aires",
                state: "CABA",
                zipCode: "C1406",
                country: "Argentina"
              },
              paymentMethod: "credit",
              trackingNumber: "1Z999AA1234567890",
              carrier: "Correo Argentino"
            },
            {
              id: 2,
              orderNumber: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
              date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              status: "shipped",
              items: [
                { id: 201, name: "Producto de ejemplo 3", price: 89.99, quantity: 1, image: "" }
              ],
              subtotal: 89.99,
              shipping: 0,
              tax: 18.90,
              total: 108.89,
              shippingAddress: {
                name: `${user?.firstName || 'Usuario'} ${user?.lastName || 'Ejemplo'}`,
                address: "Calle Falsa 123",
                city: "Córdoba",
                state: "Córdoba",
                zipCode: "X5000",
                country: "Argentina"
              },
              paymentMethod: "mercadopago",
              trackingNumber: "RA123456789AR",
              carrier: "OCA"
            },
            {
              id: 3,
              orderNumber: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
              date: new Date().toISOString(),
              status: "processing",
              items: [
                { id: 301, name: "Producto de ejemplo 4", price: 199.99, quantity: 1, image: "" },
                { id: 302, name: "Producto de ejemplo 5", price: 49.99, quantity: 2, image: "" }
              ],
              subtotal: 299.97,
              shipping: 0,
              tax: 63.00,
              total: 362.97,
              shippingAddress: {
                name: `${user?.firstName || 'Usuario'} ${user?.lastName || 'Ejemplo'}`,
                address: "Av. Libertador 1234",
                city: "Mendoza",
                state: "Mendoza",
                zipCode: "M5500",
                country: "Argentina"
              },
              paymentMethod: "credit",
              trackingNumber: null,
              carrier: null
            }
          ];
          
          localStorage.setItem('userOrders', JSON.stringify(sampleOrders));
          setOrders(sampleOrders);
        } else {
          setOrders(savedOrders);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error al cargar las órdenes:", err);
        setError("No se pudieron cargar tus órdenes. Por favor, inténtalo de nuevo más tarde.");
        setLoading(false);
      }
    };
    
    loadOrders();
  }, [user]);

  const filteredOrders = activeTab === "all" 
    ? orders 
    : orders.filter(order => order.status === activeTab);

  const getStatusBadge = (status) => {
    const statusMap = {
      processing: { text: "En proceso", color: "bg-yellow-100 text-yellow-800" },
      shipped: { text: "Enviado", color: "bg-blue-100 text-blue-800" },
      delivered: { text: "Entregado", color: "bg-green-100 text-green-800" },
      completed: { text: "Completado", color: "bg-green-100 text-green-800" },
      cancelled: { text: "Cancelado", color: "bg-red-100 text-red-800" }
    };
    
    const statusInfo = statusMap[status] || { text: status, color: "bg-gray-100 text-gray-800" };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
        {statusInfo.text}
      </span>
    );
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-AR', options);
  };

  const handleReturn = (orderId) => {
    // Lógica para manejar devoluciones
    console.log(`Iniciar devolución para la orden ${orderId}`);
  };

  const handleTrackOrder = (order) => {
    // Lógica para rastrear el pedido
    console.log(`Rastrear orden ${order.orderNumber}`, order.trackingNumber);
    
    // Mostrar detalles de envío
    setSelectedOrder(order);
  };

  const closeModal = () => {
    setSelectedOrder(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando tus compras...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-6 bg-red-100 rounded-lg max-w-md">
          <p className="text-red-700">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mis Compras</h1>
          <p className="mt-2 text-sm text-gray-500">
            Revisa el estado de tus pedidos recientes y realiza seguimiento de los envíos.
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-8 text-center">
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h2 className="mt-4 text-lg font-medium text-gray-900">Aún no has realizado compras</h2>
            <p className="mt-1 text-gray-500">
              Cuando realices una compra, podrás ver el historial aquí.
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
          <>
            {/* Filtros */}
            <div className="mb-6 border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`${activeTab === "all" ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Todas las órdenes
                </button>
                <button
                  onClick={() => setActiveTab("processing")}
                  className={`${activeTab === "processing" ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  En proceso
                </button>
                <button
                  onClick={() => setActiveTab("shipped")}
                  className={`${activeTab === "shipped" ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Enviados
                </button>
                <button
                  onClick={() => setActiveTab("completed")}
                  className={`${activeTab === "completed" ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Completados
                </button>
                <button
                  onClick={() => setActiveTab("cancelled")}
                  className={`${activeTab === "cancelled" ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Cancelados
                </button>
              </nav>
            </div>

            {/* Lista de órdenes */}
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <li key={order.id} className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="mb-4 sm:mb-0">
                          <div className="flex items-center">
                            <h3 className="text-lg font-medium text-gray-900">
                              Orden #{order.orderNumber}
                            </h3>
                            <div className="ml-4">
                              {getStatusBadge(order.status)}
                            </div>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">
                            Realizada el {formatDate(order.date)}
                          </p>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                          {order.status === 'shipped' && order.trackingNumber && (
                            <button
                              onClick={() => handleTrackOrder(order)}
                              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              <svg className="-ml-0.5 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              Rastrear envío
                            </button>
                          )}
                          
                          <Link
                            to={`/orden/${order.orderNumber}`}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Ver detalles
                          </Link>
                          
                          {order.status === 'completed' && (
                            <button
                              onClick={() => handleReturn(order.id)}
                              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              Devolver producto
                            </button>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-6 border-t border-gray-200 pt-6">
                        <h4 className="sr-only">Productos</h4>
                        <ul className="space-y-6">
                          {order.items.map((item) => (
                            <li key={item.id} className="flex">
                              <div className="flex-shrink-0 w-20 h-20 border border-gray-200 rounded-md overflow-hidden">
                                <img
                                  src={item.image || "https://via.placeholder.com/150"}
                                  alt={item.name}
                                  className="w-full h-full object-center object-cover"
                                  onError={(e) => {
                                    e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTJlOGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzY0NzQ4YiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlByb2R1Y3RvPC90ZXh0Pjwvc3ZnPg==";
                                  }}
                                />
                              </div>
                              
                              <div className="ml-4 flex-1 flex flex-col">
                                <div>
                                  <div className="flex justify-between text-base font-medium text-gray-900">
                                    <h3>{item.name}</h3>
                                    <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                                  </div>
                                  <p className="mt-1 text-sm text-gray-500">
                                    Cantidad: {item.quantity}
                                  </p>
                                </div>
                                
                                <div className="flex-1 flex items-end justify-between">
                                  <p className="text-sm text-gray-500">
                                    ${item.price.toFixed(2)} c/u
                                  </p>
                                  
                                  <div className="flex
                                  ">
                                    <button
                                      type="button"
                                      className="text-sm font-medium text-blue-600 hover:text-blue-500"
                                    >
                                      Comprar de nuevo
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                        
                        <div className="mt-6 flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">
                            Total: ${order.total?.toFixed(2) || '0.00'}
                          </p>
                          
                          <div className="flex space-x-3">
                            <Link
                              to={`/productos?search=${order.items[0]?.name || ''}`}
                              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              Ver productos similares
                            </Link>
                            
                            <Link
                              to={`/producto/${order.items[0]?.id || ''}`}
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              Ver producto
                            </Link>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="py-12 text-center">
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
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron órdenes</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      No hay órdenes que coincidan con los filtros seleccionados.
                    </p>
                    <div className="mt-6">
                      <button
                        onClick={() => setActiveTab("all")}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Ver todas las órdenes
                      </button>
                    </div>
                  </li>
                )}
              </ul>
            </div>
          </>
        )}
      </div>

      {/* Modal de seguimiento */}
      {selectedOrder && (
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={closeModal}></div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                  <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    Seguimiento de envío
                  </h3>
                  <div className="mt-4 text-left">
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Número de orden:</span> {selectedOrder.orderNumber}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      <span className="font-medium">Transportista:</span> {selectedOrder.carrier || 'No especificado'}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      <span className="font-medium">Número de seguimiento:</span> {selectedOrder.trackingNumber || 'No disponible'}
                    </p>
                    
                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-gray-900">Estado del envío</h4>
                      <div className="mt-4 flow-root">
                        <ul className="-mb-8">
                          <li>
                            <div className="relative pb-8">
                              <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                              <div className="relative flex space-x-3">
                                <div>
                                  <span className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white">
                                    <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  </span>
                                </div>
                                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                  <div>
                                    <p className="text-sm text-gray-500">Orden procesada</p>
                                  </div>
                                  <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                    {formatDate(selectedOrder.date)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </li>
                          
                          <li>
                            <div className="relative pb-8">
                              <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                              <div className="relative flex space-x-3">
                                <div>
                                  <span className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white">
                                    <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  </span>
                                </div>
                                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                  <div>
                                    <p className="text-sm text-gray-500">Orden enviada</p>
                                    <p className="text-sm text-gray-500">
                                      {selectedOrder.carrier ? `Transportista: ${selectedOrder.carrier}` : ''}
                                      {selectedOrder.trackingNumber ? ` - N° ${selectedOrder.trackingNumber}` : ''}
                                    </p>
                                  </div>
                                  <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                    {formatDate(new Date(new Date(selectedOrder.date).getTime() + 24 * 60 * 60 * 1000).toISOString())}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </li>
                          
                          <li>
                            <div className="relative pb-8">
                              <div className="relative flex space-x-3">
                                <div>
                                  <span className="h-8 w-8 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-white">
                                    <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  </span>
                                </div>
                                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                  <div>
                                    <p className="text-sm text-gray-500">En camino</p>
                                    <p className="text-sm text-gray-500">
                                      Estimado: {formatDate(new Date(new Date(selectedOrder.date).getTime() + 3 * 24 * 60 * 60 * 1000).toISOString())}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MisCompras;
