import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import usersData from "../data/users.json";

function PerfilUser() {
  const { user, isAuthenticated, logout } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Estados principales
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Estados para modales
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Estados para datos
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    dni: "",
    phone: "",
    profilePhoto: ""
  });

  const [addresses, setAddresses] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    promotions: false
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }

    // Cargar datos del usuario
    loadUserData();
  }, [user, isAuthenticated]);

  const loadUserData = () => {
    if (!user) return;

    // Buscar el usuario en users.json por email o id
    const currentUser = usersData.users.find(u =>
      u.email === user.email || u.id === user.id
    );

    if (currentUser) {
      // Cargar datos del usuario desde users.json
      setFormData({
        name: currentUser.firstName || "",
        surname: currentUser.lastName || "",
        email: currentUser.email || "",
        dni: currentUser.dni || "", // Campo que puede no existir
        phone: currentUser.phone || "", // Campo que puede no existir
        profilePhoto: currentUser.profilePhoto || ""
      });
    } else {
      // Si no se encuentra el usuario, usar datos básicos del contexto
      setFormData({
        name: user.name || "",
        surname: user.surname || "",
        email: user.email || "",
        dni: user.dni || "",
        phone: "",
        profilePhoto: user.profilePhoto || ""
      });
    }

    // Simular direcciones
    setAddresses([
      {
        id: 1,
        title: "Casa",
        street: "Calle Principal 123",
        city: "Madrid",
        province: "Madrid",
        zipCode: "28001",
        isMain: true
      },
      {
        id: 2,
        title: "Trabajo",
        street: "Avenida Empresarial 456",
        city: "Madrid",
        province: "Madrid",
        zipCode: "28002",
        isMain: false
      }
    ]);

    // Simular métodos de pago
    setPaymentMethods([
      {
        id: 1,
        type: "card",
        brand: "Visa",
        lastFour: "1234",
        expiryMonth: "12",
        expiryYear: "2025",
        holderName: "Juan Pérez"
      }
    ]);

    // Simular pedidos
    setOrders([
      {
        id: "ORD001",
        date: "2024-01-15",
        status: "delivered",
        total: 89900,
        items: [
          { name: "Zapatillas Nike", quantity: 1, price: 89900 }
        ]
      }
    ]);

    // Cargar wishlist real desde localStorage
    const favoritesKey = `favorites_${user.email}`;
    const userFavorites = JSON.parse(localStorage.getItem(favoritesKey) || '[]');
    setWishlist(userFavorites);

  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simular guardado de datos
    setTimeout(() => {
      // Aquí se podría implementar la lógica para actualizar el archivo users.json
      // o enviar los datos al backend

      // Actualizar localStorage con los nuevos datos
      localStorage.setItem("userName", formData.name);
      localStorage.setItem("userSurname", formData.surname);
      localStorage.setItem("userDni", formData.dni);

      setLoading(false);
      setIsEditing(false);
      setMessage("Información actualizada correctamente");
      setTimeout(() => setMessage(""), 3000);
    }, 1000);
  };

  const handleCancel = () => {
    setIsEditing(false);
    loadUserData();
  };

  // Funciones para direcciones
  const addAddress = (addressData) => {
    const newAddress = {
      ...addressData,
      id: Date.now(),
      isMain: addresses.length === 0
    };
    setAddresses([...addresses, newAddress]);
    setShowAddressModal(false);
    setMessage("Dirección agregada correctamente");
    setTimeout(() => setMessage(""), 3000);
  };

  const deleteAddress = (id) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
    setMessage("Dirección eliminada correctamente");
    setTimeout(() => setMessage(""), 3000);
  };

  const setMainAddress = (id) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isMain: addr.id === id
    })));
    setMessage("Dirección principal actualizada");
    setTimeout(() => setMessage(""), 3000);
  };

  // Funciones para métodos de pago
  const addPaymentMethod = (paymentData) => {
    const newPayment = {
      ...paymentData,
      id: Date.now()
    };
    setPaymentMethods([...paymentMethods, newPayment]);
    setShowPaymentModal(false);
    setMessage("Método de pago agregado correctamente");
    setTimeout(() => setMessage(""), 3000);
  };

  const deletePaymentMethod = (id) => {
    setPaymentMethods(paymentMethods.filter(method => method.id !== id));
    setMessage("Método de pago eliminado correctamente");
    setTimeout(() => setMessage(""), 3000);
  };

  // Funciones para wishlist
  const moveToCart = (product) => {
    addToCart(product);
    setMessage("Producto agregado al carrito");
    setTimeout(() => setMessage(""), 3000);
  };

  const removeFromWishlist = (id) => {
    const updatedWishlist = wishlist.filter(item => item.id !== id);
    setWishlist(updatedWishlist);

    // Actualizar localStorage
    const favoritesKey = `favorites_${user.email}`;
    localStorage.setItem(favoritesKey, JSON.stringify(updatedWishlist));

    setMessage("Producto eliminado de la lista de deseos");
    setTimeout(() => setMessage(""), 3000);
  };


  // Funciones auxiliares
  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'delivered': return 'Entregado';
      case 'shipped': return 'Enviado';
      case 'processing': return 'Procesando';
      default: return 'Pendiente';
    }
  };

  const tabs = [
    { id: "profile", label: "Perfil", icon: "👤" },
    { id: "addresses", label: "Direcciones", icon: "📍" },
    { id: "payments", label: "Pagos", icon: "💳" },
    { id: "orders", label: "Pedidos", icon: "📦" },
    { id: "wishlist", label: "Favoritos", icon: "❤️" },
    { id: "security", label: "Seguridad", icon: "🔒" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Mi Perfil</h1>
          <p className="text-gray-600">Gestiona tu información personal y configuración de cuenta</p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.includes("Error")
              ? "bg-red-100 text-red-700 border border-red-300"
              : "bg-green-100 text-green-700 border border-green-300"
            }`}>
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              {/* Profile Info */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-3">
                  {formData.name ? formData.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <h3 className="font-bold text-gray-800">{formData.name} {formData.surname}</h3>
                <p className="text-sm text-gray-600">{formData.email}</p>
              </div>

              {/* Navigation Tabs */}
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${activeTab === tab.id
                        ? "bg-blue-50 text-blue-700 border-l-4 border-blue-700"
                        : "text-gray-600 hover:bg-gray-50"
                      }`}
                  >
                    <span className="mr-3">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </nav>

              {/* Logout Button */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <span className="mr-3">🚪</span>
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Información Personal */}
            {activeTab === "profile" && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Información Personal</h2>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {isEditing ? "Cancelar" : "Editar"}
                  </button>
                </div>

                <form onSubmit={handleSave}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full px-3 py-2 border rounded-lg ${isEditing ? "border-gray-300 focus:ring-2 focus:ring-blue-500" : "border-gray-200 bg-gray-50"
                          }`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Apellidos</label>
                      <input
                        type="text"
                        name="surname"
                        value={formData.surname}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full px-3 py-2 border rounded-lg ${isEditing ? "border-gray-300 focus:ring-2 focus:ring-blue-500" : "border-gray-200 bg-gray-50"
                          }`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        disabled={true}
                        className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg"
                      />
                      <p className="text-xs text-gray-500 mt-1">El email no se puede modificar</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">DNI</label>
                      <input
                        type="text"
                        name="dni"
                        value={formData.dni}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full px-3 py-2 border rounded-lg ${isEditing ? "border-gray-300 focus:ring-2 focus:ring-blue-500" : "border-gray-200 bg-gray-50"
                          }`}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full px-3 py-2 border rounded-lg ${isEditing ? "border-gray-300 focus:ring-2 focus:ring-blue-500" : "border-gray-200 bg-gray-50"
                          }`}
                      />
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex space-x-4 mt-6">
                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        {loading ? "Guardando..." : "Guardar Cambios"}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="bg-gray-300 text-gray-700 py-2 px-6 rounded-lg hover:bg-gray-400 transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  )}
                </form>
              </div>
            )}

            {/* Direcciones */}
            {activeTab === "addresses" && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Direcciones de Envío</h2>
                  <button
                    onClick={() => setShowAddressModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    + Agregar Dirección
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((address) => (
                    <div key={address.id} className={`border rounded-lg p-4 ${address.isMain ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-800">{address.title}</h3>
                        {address.isMain && (
                          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">Principal</span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mb-3">
                        {address.street}<br />
                        {address.city}, {address.province}<br />
                        CP: {address.zipCode}
                      </p>
                      <div className="flex space-x-2">
                        {!address.isMain && (
                          <button
                            onClick={() => setMainAddress(address.id)}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            Marcar como principal
                          </button>
                        )}
                        <button
                          onClick={() => deleteAddress(address.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Métodos de Pago */}
            {activeTab === "payments" && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Métodos de Pago</h2>
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    + Agregar Método
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          {method.type === 'card' ? (
                            <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white text-xs font-bold mr-3">
                              {method.brand}
                            </div>
                          ) : (
                            <div className="w-8 h-8 bg-yellow-500 rounded flex items-center justify-center text-white text-xs font-bold mr-3">
                              PP
                            </div>
                          )}
                          <div>
                            <h3 className="font-semibold text-gray-800">
                              {method.type === 'card' ? `${method.brand} ****${method.lastFour}` : 'PayPal'}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {method.type === 'card' ? `Vence ${method.expiryMonth}/${method.expiryYear}` : method.email}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => deletePaymentMethod(method.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mis Pedidos */}
            {activeTab === "orders" && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Mis Pedidos</h2>

                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-800">Pedido #{order.id}</h3>
                          <p className="text-sm text-gray-600">Fecha: {order.date}</p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                          <p className="text-lg font-bold text-gray-800 mt-1">${order.total.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-600">{order.items.length} producto(s)</p>
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowOrderModal(true);
                          }}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          Ver Detalles
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Lista de Deseos */}
            {activeTab === "wishlist" && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Lista de Deseos</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {wishlist.map((product) => (
                    <div key={product.id} className="border border-gray-200 rounded-lg p-4">
                      {/* Enlace clickeable para navegar al detalle del producto */}
                      <Link to={`/producto/${product.id}`} className="block">
                        <img
                          src={product.imageUrl || product.image}
                          alt={product.name}
                          className="w-full h-32 object-cover rounded mb-3 hover:opacity-80 transition-opacity"
                          onError={(e) => {
                            // Imagen por defecto en caso de error al cargar la imagen original
                            e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTJlOGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzY0NzQ4YiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlByb2R1Y3RvPC90ZXh0Pjwvc3ZnPg==";
                          }}
                        />
                        <h3 className="font-semibold text-gray-800 mb-2 hover:text-blue-600 transition-colors">{product.name}</h3>
                      </Link>
                      <p className="text-lg font-bold text-blue-600 mb-3">${product.price.toLocaleString()}</p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => moveToCart(product)}
                          className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          Agregar al Carrito
                        </button>
                        <button
                          onClick={() => removeFromWishlist(product.id)}
                          className="bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 transition-colors text-sm"
                        >
                          ❌
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}


            {/* Seguridad */}
            {activeTab === "security" && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Seguridad y Configuración</h2>

                <div className="space-y-6">
                  {/* Cambiar Contraseña */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-2">Cambiar Contraseña</h3>
                    <p className="text-sm text-gray-600 mb-4">Actualiza tu contraseña para mantener tu cuenta segura</p>
                    <button
                      onClick={() => setShowPasswordModal(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Cambiar Contraseña
                    </button>
                  </div>

                  {/* Notificaciones */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-4">Preferencias de Notificación</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-800">Notificaciones por Email</h4>
                          <p className="text-sm text-gray-600">Recibe actualizaciones sobre tus pedidos</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={settings.emailNotifications}
                            onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-800">Promociones y Ofertas</h4>
                          <p className="text-sm text-gray-600">Recibe ofertas especiales y descuentos</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={settings.promotions}
                            onChange={(e) => setSettings({ ...settings, promotions: e.target.checked })}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modales */}
        {showAddressModal && (
          <AddressModal
            onClose={() => setShowAddressModal(false)}
            onSave={addAddress}
          />
        )}

        {showPaymentModal && (
          <PaymentModal
            onClose={() => setShowPaymentModal(false)}
            onSave={addPaymentMethod}
          />
        )}

        {showOrderModal && selectedOrder && (
          <OrderModal
            order={selectedOrder}
            onClose={() => {
              setShowOrderModal(false);
              setSelectedOrder(null);
            }}
          />
        )}

        {showPasswordModal && (
          <PasswordModal
            onClose={() => setShowPasswordModal(false)}
            onSave={() => {
              setShowPasswordModal(false);
              setMessage("Contraseña actualizada correctamente");
              setTimeout(() => setMessage(""), 3000);
            }}
          />
        )}

        {showLogoutModal && (
          <LogoutConfirmModal
            onClose={() => setShowLogoutModal(false)}
            onConfirm={() => {
              logout();
              navigate("/");
            }}
          />
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

// Componentes de Modal
const AddressModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: "",
    street: "",
    city: "",
    province: "",
    zipCode: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-bold mb-4">Agregar Nueva Dirección</h3>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Título (Casa, Trabajo, etc.)"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
            <input
              type="text"
              placeholder="Calle y número"
              value={formData.street}
              onChange={(e) => setFormData({ ...formData, street: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
            <input
              type="text"
              placeholder="Ciudad"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
            <input
              type="text"
              placeholder="Provincia"
              value={formData.province}
              onChange={(e) => setFormData({ ...formData, province: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
            <input
              type="text"
              placeholder="Código Postal"
              value={formData.zipCode}
              onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div className="flex space-x-4 mt-6">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            >
              Guardar
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const PaymentModal = ({ onClose, onSave }) => {
  const [paymentType, setPaymentType] = useState("card");
  const [formData, setFormData] = useState({
    holderName: "",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    email: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (paymentType === "card") {
      onSave({
        type: "card",
        brand: "Visa", // Simplificado
        lastFour: formData.cardNumber.slice(-4),
        expiryMonth: formData.expiryMonth,
        expiryYear: formData.expiryYear,
        holderName: formData.holderName
      });
    } else {
      onSave({
        type: "paypal",
        email: formData.email
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-bold mb-4">Agregar Método de Pago</h3>

        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => setPaymentType("card")}
            className={`flex-1 py-2 px-4 rounded-lg ${paymentType === "card" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            Tarjeta
          </button>
          <button
            onClick={() => setPaymentType("paypal")}
            className={`flex-1 py-2 px-4 rounded-lg ${paymentType === "paypal" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            PayPal
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {paymentType === "card" ? (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nombre del titular"
                value={formData.holderName}
                onChange={(e) => setFormData({ ...formData, holderName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="Número de tarjeta"
                value={formData.cardNumber}
                onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="MM"
                  value={formData.expiryMonth}
                  onChange={(e) => setFormData({ ...formData, expiryMonth: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
                <input
                  type="text"
                  placeholder="YYYY"
                  value={formData.expiryYear}
                  onChange={(e) => setFormData({ ...formData, expiryYear: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
                <input
                  type="text"
                  placeholder="CVV"
                  value={formData.cvv}
                  onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
            </div>
          ) : (
            <input
              type="email"
              placeholder="Email de PayPal"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          )}

          <div className="flex space-x-4 mt-6">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            >
              Guardar
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const OrderModal = ({ order, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Detalles del Pedido #{order.id}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Fecha:</span> {order.date}
            </div>
            <div>
              <span className="font-medium">Estado:</span>
              <span className={`ml-2 px-2 py-1 rounded-full text-xs ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                {order.status === 'delivered' ? 'Entregado' : 'Enviado'}
              </span>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Productos:</h4>
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between py-2">
                <span>{item.name} x{item.quantity}</span>
                <span>${item.price.toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 flex justify-between font-bold">
            <span>Total:</span>
            <span>${order.total.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const PasswordModal = ({ onClose, onSave }) => {
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      alert("Las contraseñas no coinciden");
      return;
    }
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-bold mb-4">Cambiar Contraseña</h3>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input
              type="password"
              placeholder="Contraseña actual"
              value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
            <input
              type="password"
              placeholder="Nueva contraseña"
              value={passwords.new}
              onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
            <input
              type="password"
              placeholder="Confirmar nueva contraseña"
              value={passwords.confirm}
              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div className="flex space-x-4 mt-6">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            >
              Cambiar
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const LogoutConfirmModal = ({ onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <span className="text-2xl">🚪</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Cerrar Sesión</h3>
          <p className="text-sm text-gray-600 mb-6">
            ¿Estás seguro de que quieres cerrar sesión? Tendrás que volver a iniciar sesión para acceder a tu cuenta.
          </p>
          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfilUser;
