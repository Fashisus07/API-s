// Importar React y hooks necesarios para el componente de checkout
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"; // Hooks para navegación
import { checkout as apiCheckout } from "../services/apiService";
import { useAuth } from "../context/AuthContext"; // Contexto de autenticación
import { useCart } from "../context/CartContext"; // Contexto del carrito

// Componente Checkout - Página de proceso de compra
function Checkout() {
  const { user } = useAuth(); // Obtener datos del usuario autenticado
  const { cartItems, getTotalPrice, clearCart } = useCart(); // Funciones del carrito
  const navigate = useNavigate(); // Hook para navegación programática

  // Estado del formulario de checkout inicializado con datos del usuario
  const [formData, setFormData] = useState({
    firstName: user?.name || "", // Nombre del usuario o vacío
    lastName: user?.surname || "", // Apellido del usuario o vacío
    email: user?.email || "", // Email del usuario o vacío
    phone: "", // Teléfono (campo nuevo)
    address: "", // Dirección de envío
    city: "", // Ciudad
    postalCode: "", // Código postal
    province: "", // Provincia
    paymentMethod: "credit-card", // Método de pago por defecto
    cardNumber: "", // Número de tarjeta
    expiryDate: "", // Fecha de vencimiento
    cvv: "", // Código de seguridad
    cardName: "", // Nombre en la tarjeta
    shippingMethod: "standard" // Método de envío por defecto
  });

  const [errors, setErrors] = useState({}); // Estado para errores de validación
  const [processing, setProcessing] = useState(false); // Estado de procesamiento de la orden
  const [orderComplete, setOrderComplete] = useState(false); // Estado de orden completada
  const [orderId, setOrderId] = useState(""); // ID de la orden generada
  const [currentStep, setCurrentStep] = useState(1); // Paso actual del checkout (1, 2, 3)
  const [showCardDetails, setShowCardDetails] = useState(true); // Mostrar/ocultar detalles de tarjeta

  // Opciones de envío disponibles con precios y tiempos
  const shippingOptions = [
    { id: "standard", name: "Envío estándar", price: 0, time: "5-7 días hábiles" },
    { id: "express", name: "Envío express", price: 500, time: "2-3 días hábiles" },
    { id: "same-day", name: "Envío mismo día", price: 1200, time: "Hoy antes de 20hs" }
  ];

  const paymentMethods = [
    { id: "credit-card", name: "Tarjeta de crédito", icon: "💳" },
    { id: "debit-card", name: "Tarjeta de débito", icon: "💳" },
    { id: "transfer", name: "Transferencia bancaria", icon: "🏦" },
    { id: "mercado-pago", name: "Mercado Pago", icon: "💰" }
  ];

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/carrito");
      return;
    }
  }, [cartItems, navigate]);

  const getShippingPrice = () => {
    const selected = shippingOptions.find(option => option.id === formData.shippingMethod);
    return selected ? selected.price : 0;
  };

  const getTotalWithShipping = () => {
    return getTotalPrice() + getShippingPrice();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'paymentMethod') {
      setShowCardDetails(['credit-card', 'debit-card'].includes(value));
    }

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = "El nombre es requerido";
    if (!formData.lastName.trim()) newErrors.lastName = "El apellido es requerido";
    if (!formData.email.trim()) newErrors.email = "El email es requerido";
    if (!formData.phone.trim()) newErrors.phone = "El teléfono es requerido";
    if (!formData.address.trim()) newErrors.address = "La dirección es requerida";
    if (!formData.city.trim()) newErrors.city = "La ciudad es requerida";
    if (!formData.postalCode.trim()) newErrors.postalCode = "El código postal es requerido";
    if (!formData.province.trim()) newErrors.province = "La provincia es requerida";

    if (showCardDetails) {
      if (!formData.cardNumber.trim()) newErrors.cardNumber = "El número de tarjeta es requerido";
      if (!formData.expiryDate.trim()) newErrors.expiryDate = "La fecha de vencimiento es requerida";
      if (!formData.cvv.trim()) newErrors.cvv = "El CVV es requerido";
      if (!formData.cardName.trim()) newErrors.cardName = "El nombre en la tarjeta es requerido";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setProcessing(true);

    try {
      // Si no está autenticado, redirigir a login
      if (!user || !user.email) {
        setErrors({ submit: "Debes iniciar sesión para completar la compra" });
        setProcessing(false);
        navigate('/login');
        return;
      }

      // Llamar al endpoint del backend que procesa el checkout y actualiza stock
      const response = await apiCheckout();

      // Si la respuesta fue exitosa, backend se encargó de decrementar stock y limpiar el carrito en BD
      const newOrderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      setOrderId(newOrderId);

      // Limpiar carrito local y marcar orden completada
      clearCart();

      // Forzar refresh global de productos (para que desaparezcan los que quedaron sin stock)
      try {
        window.dispatchEvent(new CustomEvent('productsUpdated'));
      } catch (e) {
        console.warn('No se pudo dispatch productsUpdated event', e);
      }
      setOrderComplete(true);
    } catch (error) {
      console.error('Error en checkout:', error);
      setErrors({ submit: error?.message || "Error al procesar el pago. Inténtalo nuevamente." });
    } finally {
      setProcessing(false);
    }
  };

  const nextStep = () => {
    if (currentStep === 1) {
      const stepErrors = {};
      if (!formData.firstName.trim()) stepErrors.firstName = "El nombre es requerido";
      if (!formData.lastName.trim()) stepErrors.lastName = "El apellido es requerido";
      if (!formData.email.trim()) stepErrors.email = "El email es requerido";
      if (!formData.phone.trim()) stepErrors.phone = "El teléfono es requerido";
      if (!formData.address.trim()) stepErrors.address = "La dirección es requerida";
      if (!formData.city.trim()) stepErrors.city = "La ciudad es requerida";
      if (!formData.postalCode.trim()) stepErrors.postalCode = "El código postal es requerido";
      if (!formData.province.trim()) stepErrors.province = "La provincia es requerida";

      if (Object.keys(stepErrors).length > 0) {
        setErrors(stepErrors);
        return;
      }
    }

    setCurrentStep(prev => Math.min(prev + 1, 3));
    setErrors({});
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setErrors({});
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-green-600 mb-4">¡Compra exitosa!</h2>
          <p className="text-gray-600 mb-4">
            Tu pedido ha sido procesado correctamente.
          </p>
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-600">Número de orden:</p>
            <p className="font-bold text-lg">{orderId}</p>
          </div>
          <div className="space-y-3">
            <Link
              to="/mis-compras"
              className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Ver mis compras
            </Link>
            <Link
              to="/"
              className="block w-full bg-gray-100 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Finalizar Compra</h1>
          <p className="text-gray-600">Completa los datos para procesar tu pedido</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${currentStep >= step
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-300 text-gray-600'
                  }`}>
                  {step}
                </div>
                <span className={`ml-2 ${currentStep >= step ? 'text-blue-600 font-semibold' : 'text-gray-500'
                  }`}>
                  {step === 1 && 'Datos'}
                  {step === 2 && 'Envío'}
                  {step === 3 && 'Pago'}
                </span>
                {step < 3 && <div className="w-16 h-1 bg-gray-300 ml-4"></div>}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6">
              {/* Step 1: Personal Data */}
              {currentStep === 1 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-6">Datos Personales y Dirección</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.firstName ? 'border-red-500' : 'border-gray-300'
                          }`}
                      />
                      {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Apellido *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.lastName ? 'border-red-500' : 'border-gray-300'
                          }`}
                      />
                      {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'
                          }`}
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Teléfono *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'
                          }`}
                      />
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dirección *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Calle y número"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.address ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ciudad *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.city ? 'border-red-500' : 'border-gray-300'
                          }`}
                      />
                      {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Provincia *
                      </label>
                      <input
                        type="text"
                        name="province"
                        value={formData.province}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.province ? 'border-red-500' : 'border-gray-300'
                          }`}
                      />
                      {errors.province && <p className="text-red-500 text-sm mt-1">{errors.province}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Código Postal *
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.postalCode ? 'border-red-500' : 'border-gray-300'
                          }`}
                      />
                      {errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={nextStep}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Continuar
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Shipping */}
              {currentStep === 2 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-6">Método de Envío</h2>

                  <div className="space-y-4 mb-6">
                    {shippingOptions.map((option) => (
                      <label key={option.id} className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="shippingMethod"
                          value={option.id}
                          checked={formData.shippingMethod === option.id}
                          onChange={handleInputChange}
                          className="mr-3"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-semibold">{option.name}</p>
                              <p className="text-sm text-gray-600">{option.time}</p>
                            </div>
                            <p className="font-bold">
                              {option.price === 0 ? 'Gratis' : `$${option.price}`}
                            </p>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>

                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Atrás
                    </button>
                    <button
                      type="button"
                      onClick={nextStep}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Continuar
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {currentStep === 3 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-6">Método de Pago</h2>

                  <div className="space-y-4 mb-6">
                    {paymentMethods.map((method) => (
                      <label key={method.id} className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={formData.paymentMethod === method.id}
                          onChange={handleInputChange}
                          className="mr-3"
                        />
                        <span className="text-2xl mr-3">{method.icon}</span>
                        <span className="font-semibold">{method.name}</span>
                      </label>
                    ))}
                  </div>

                  {showCardDetails && (
                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                      <h3 className="font-semibold mb-4">Datos de la Tarjeta</h3>

                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Número de tarjeta *
                          </label>
                          <input
                            type="text"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleInputChange}
                            placeholder="1234 5678 9012 3456"
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                              }`}
                          />
                          {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nombre en la tarjeta *
                          </label>
                          <input
                            type="text"
                            name="cardName"
                            value={formData.cardName}
                            onChange={handleInputChange}
                            placeholder="Como aparece en la tarjeta"
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.cardName ? 'border-red-500' : 'border-gray-300'
                              }`}
                          />
                          {errors.cardName && <p className="text-red-500 text-sm mt-1">{errors.cardName}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Vencimiento *
                            </label>
                            <input
                              type="text"
                              name="expiryDate"
                              value={formData.expiryDate}
                              onChange={handleInputChange}
                              placeholder="MM/AA"
                              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.expiryDate ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.expiryDate && <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              CVV *
                            </label>
                            <input
                              type="text"
                              name="cvv"
                              value={formData.cvv}
                              onChange={handleInputChange}
                              placeholder="123"
                              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.cvv ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {errors.submit && (
                    <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
                      {errors.submit}
                    </div>
                  )}

                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Atrás
                    </button>
                    <button
                      type="submit"
                      disabled={processing}
                      className="bg-green-600 text-white px-8 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                    >
                      {processing ? "Procesando..." : "Finalizar Compra"}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Resumen del Pedido</h2>

              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <img
                      src={item.imageUrl || item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded border"
                      onError={(e) => {
                        e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2UyZThmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTAiIGZpbGw9IiM2NDc0OGIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JTUc8L3RleHQ+PC9zdmc+";
                      }}
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{item.name}</p>
                      <p className="text-gray-600 text-sm">Cantidad: {item.quantity}</p>
                    </div>
                    <p className="font-bold">${item.price * item.quantity}</p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold">${getTotalPrice()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Envío:</span>
                  <span className="font-semibold">
                    {getShippingPrice() === 0 ? 'Gratis' : `$${getShippingPrice()}`}
                  </span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-blue-600">${getTotalWithShipping()}</span>
                  </div>
                </div>
              </div>

              {/* 'Compra Segura' removed as requested */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
