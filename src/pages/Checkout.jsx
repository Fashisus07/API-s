import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

function Checkout() {
  const { user } = useAuth();
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  
  // Estados para el formulario
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Argentina",
    shippingMethod: "standard",
    paymentMethod: "creditCard",
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvv: "",
    saveInfo: false,
    termsAccepted: false
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [orderNumber, setOrderNumber] = useState("");
  
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = getTotalPrice();
  const shipping = formData.shippingMethod === "express" ? 1000 : 500;
  const tax = subtotal * 0.21; // 21% de IVA
  const total = subtotal + shipping + tax;

  useEffect(() => {
    if (cartItems.length === 0 && !orderPlaced) {
      navigate("/carrito");
    }
  }, [cartItems, orderPlaced, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  const validateStep = (step) => {
    switch (step) {
      case 1: // Información de envío
        if (!formData.firstName || !formData.lastName || !formData.email || 
            !formData.phone || !formData.address || !formData.city || 
            !formData.state || !formData.zipCode) {
          setError("Por favor completa todos los campos obligatorios.");
          return false;
        }
        if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
          setError("Por favor ingresa un correo electrónico válido.");
          return false;
        }
        return true;
      case 2: // Método de envío
        return true; // Siempre válido ya que tiene un valor por defecto
      case 3: // Método de pago
        if (!formData.cardNumber || !formData.cardName || 
            !formData.cardExpiry || !formData.cardCvv) {
          setError("Por favor completa todos los datos de la tarjeta.");
          return false;
        }
        if (!formData.termsAccepted) {
          setError("Debes aceptar los términos y condiciones para continuar.");
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) return;
    
    setLoading(true);
    setError("");
    
    try {
      // Simular una llamada a la API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generar número de orden aleatorio
      const newOrderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderNumber(newOrderNumber);
      
      // Limpiar carrito y marcar orden como completada
      clearCart();
      setOrderPlaced(true);
      
      // Guardar orden en el historial del usuario (simulado)
      const order = {
        orderNumber: newOrderNumber,
        date: new Date().toISOString(),
        items: cartItems,
        shipping: {
          name: `${formData.firstName} ${formData.lastName}`,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
          method: formData.shippingMethod
        },
        payment: {
          method: formData.paymentMethod,
          cardLast4: formData.cardNumber.slice(-4)
        },
        subtotal,
        shippingCost: shipping,
        tax,
        total
      };
      
      // Guardar en localStorage para simular historial
      const userOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
      userOrders.push(order);
      localStorage.setItem('userOrders', JSON.stringify(userOrders));
      
      // Ir al paso de confirmación
      setCurrentStep(4);
      
    } catch (err) {
      console.error("Error al procesar el pedido:", err);
      setError("Ocurrió un error al procesar tu pedido. Por favor, inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  // Si el carrito está vacío y no es una orden completada, redirigir al carrito
  if (cartItems.length === 0 && !orderPlaced) {
    return null; // La redirección se maneja en el useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link to="/carrito" className="text-blue-600 hover:text-blue-800 font-medium">
            ← Volver al carrito
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Finalizar Compra</h1>
        
        {/* Pasos del checkout */}
        <div className="mb-8">
          <nav className="flex items-center justify-center">
            <ol className="flex items-center space-x-4">
              {[1, 2, 3, 4].map((step) => (
                <li key={step} className="flex items-center">
                  <span 
                    className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                  >
                    {step}
                  </span>
                  {step < 4 && (
                    <span className={`h-0.5 w-10 mx-2 ${currentStep > step ? 'bg-blue-600' : 'bg-gray-200'}`}></span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
          <div className="mt-4 text-center text-sm text-gray-500">
            {currentStep === 1 && "Información de envío"}
            {currentStep === 2 && "Método de envío"}
            {currentStep === 3 && "Pago"}
            {currentStep === 4 && "Confirmación"}
          </div>
        </div>
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            <p>{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Columna principal */}
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 mb-6">
                <h2 className="text-lg font-medium text-gray-900 mb-6">Información de contacto</h2>
                
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                      Apellido *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="sm:col-span-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Correo electrónico *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="sm:col-span-4">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="sm:col-span-6">
                    <h3 className="text-md font-medium text-gray-900 mb-4 mt-2">Dirección de envío</h3>
                  </div>
                  
                  <div className="sm:col-span-6">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      Dirección *
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Calle y número"
                    />
                  </div>
                  
                  <div className="sm:col-span-6">
                    <label htmlFor="address2" className="block text-sm font-medium text-gray-700">
                      Departamento, piso, etc. (opcional)
                    </label>
                    <input
                      type="text"
                      id="address2"
                      name="address2"
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                      Ciudad *
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                      Provincia *
                    </label>
                    <select
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Selecciona una provincia</option>
                      <option value="Buenos Aires">Buenos Aires</option>
                      <option value="CABA">Ciudad Autónoma de Buenos Aires</option>
                      <option value="Catamarca">Catamarca</option>
                      <option value="Chaco">Chaco</option>
                      <option value="Chubut">Chubut</option>
                      <option value="Córdoba">Córdoba</option>
                      <option value="Corrientes">Corrientes</option>
                      <option value="Entre Ríos">Entre Ríos</option>
                      <option value="Formosa">Formosa</option>
                      <option value="Jujuy">Jujuy</option>
                      <option value="La Pampa">La Pampa</option>
                      <option value="La Rioja">La Rioja</option>
                      <option value="Mendoza">Mendoza</option>
                      <option value="Misiones">Misiones</option>
                      <option value="Neuquén">Neuquén</option>
                      <option value="Río Negro">Río Negro</option>
                      <option value="Salta">Salta</option>
                      <option value="San Juan">San Juan</option>
                      <option value="San Luis">San Luis</option>
                      <option value="Santa Cruz">Santa Cruz</option>
                      <option value="Santa Fe">Santa Fe</option>
                      <option value="Santiago del Estero">Santiago del Estero</option>
                      <option value="Tierra del Fuego">Tierra del Fuego</option>
                      <option value="Tucumán">Tucumán</option>
                    </select>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                      Código postal *
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                      País
                    </label>
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-100"
                      disabled
                    >
                      <option>Argentina</option>
                    </select>
                  </div>
                </div>
                
                <div className="mt-6 flex items-center">
                  <input
                    id="saveInfo"
                    name="saveInfo"
                    type="checkbox"
                    checked={formData.saveInfo}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="saveInfo" className="ml-2 block text-sm text-gray-700">
                    Guardar esta información para la próxima vez
                  </label>
                </div>
              </div>
            )}
            
            {currentStep === 2 && (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 mb-6">
                <h2 className="text-lg font-medium text-gray-900 mb-6">Método de envío</h2>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="shipping-standard"
                        name="shippingMethod"
                        type="radio"
                        value="standard"
                        checked={formData.shippingMethod === "standard"}
                        onChange={handleInputChange}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="shipping-standard" className="font-medium text-gray-700">
                        Envío estándar
                      </label>
                      <p className="text-gray-500">
                        Entrega en 3-5 días hábiles
                      </p>
                      <p className="text-gray-900 font-medium mt-1">
                        $500,00
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="shipping-express"
                        name="shippingMethod"
                        type="radio"
                        value="express"
                        checked={formData.shippingMethod === "express"}
                        onChange={handleInputChange}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="shipping-express" className="font-medium text-gray-700">
                        Envío exprés
                      </label>
                      <p className="text-gray-500">
                        Entrega al día siguiente
                      </p>
                      <p className="text-gray-900 font-medium mt-1">
                        $1.000,00
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {currentStep === 3 && (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 mb-6">
                <h2 className="text-lg font-medium text-gray-900 mb-6">Método de pago</h2>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center">
                      <input
                        id="credit-card"
                        name="paymentMethod"
                        type="radio"
                        value="creditCard"
                        checked={formData.paymentMethod === "creditCard"}
                        onChange={handleInputChange}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                      />
                      <label htmlFor="credit-card" className="ml-3 block text-sm font-medium text-gray-700">
                        Tarjeta de crédito o débito
                      </label>
                    </div>
                    
                    {formData.paymentMethod === "creditCard" && (
                      <div className="mt-4 space-y-4">
                        <div>
                          <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
                            Número de tarjeta *
                          </label>
                          <input
                            type="text"
                            id="cardNumber"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleInputChange}
                            placeholder="1234 5678 9012 3456"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="cardName" className="block text-sm font-medium text-gray-700">
                            Nombre del titular *
                          </label>
                          <input
                            type="text"
                            id="cardName"
                            name="cardName"
                            value={formData.cardName}
                            onChange={handleInputChange}
                            placeholder="Como figura en la tarjeta"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="cardExpiry" className="block text-sm font-medium text-gray-700">
                              Vencimiento (MM/AA) *
                            </label>
                            <input
                              type="text"
                              id="cardExpiry"
                              name="cardExpiry"
                              value={formData.cardExpiry}
                              onChange={handleInputChange}
                              placeholder="MM/AA"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="cardCvv" className="block text-sm font-medium text-gray-700">
                              CVV *
                            </label>
                            <input
                              type="text"
                              id="cardCvv"
                              name="cardCvv"
                              value={formData.cardCvv}
                              onChange={handleInputChange}
                              placeholder="123"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center">
                      <input
                        id="payment-mp"
                        name="paymentMethod"
                        type="radio"
                        value="mercadopago"
                        checked={formData.paymentMethod === "mercadopago"}
                        onChange={handleInputChange}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                      />
                      <label htmlFor="payment-mp" className="ml-3 block text-sm font-medium text-gray-700">
                        Mercado Pago
                      </label>
                      <img 
                        src="https://http2.mlstatic.com/frontend-assets/ui-navigation/5.14.0/mercadopago/logo__large_plus.png" 
                        alt="Mercado Pago" 
                        className="h-6 ml-2"
                      />
                    </div>
                    
                    {formData.paymentMethod === "mercadopago" && (
                      <p className="mt-2 text-sm text-gray-500">
                        Serás redirigido a la plataforma de Mercado Pago para completar el pago de forma segura.
                      </p>
                    )}
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center">
                      <input
                        id="payment-cash"
                        name="paymentMethod"
                        type="radio"
                        value="cash"
                        checked={formData.paymentMethod === "cash"}
                        onChange={handleInputChange}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                      />
                      <label htmlFor="payment-cash" className="ml-3 block text-sm font-medium text-gray-700">
                        Efectivo en puntos de pago
                      </label>
                    </div>
                    
                    {formData.paymentMethod === "cash" && (
                      <p className="mt-2 text-sm text-gray-500">
                        Podrás pagar en efectivo en Pago Fácil, RapiPago u otras sucursales habilitadas.
                      </p>
                    )}
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="terms"
                          name="termsAccepted"
                          type="checkbox"
                          checked={formData.termsAccepted}
                          onChange={handleInputChange}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="terms" className="font-medium text-gray-700">
                          Acepto los <a href="/terminos" className="text-blue-600 hover:text-blue-800">Términos y Condiciones</a> y las 
                          <a href="/privacidad" className="text-blue-600 hover:text-blue-800"> Políticas de Privacidad</a> *
                        </label>
                        <p className="text-gray-500 mt-1">
                          Al hacer clic en &quot;Realizar pedido&quot;, aceptas nuestros términos y condiciones.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {currentStep === 4 && orderPlaced && (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 mb-6 text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                  <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="mt-4 text-2xl font-bold text-gray-900">¡Gracias por tu compra!</h2>
                <p className="mt-2 text-gray-600">
                  Tu pedido ha sido confirmado con el número: 
                  <span className="font-semibold">{orderNumber}</span>
                </p>
                <p className="mt-2 text-gray-600">
                  Hemos enviado un correo de confirmación a <span className="font-semibold">{formData.email}</span>
                </p>
                
                <div className="mt-8 border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900">Resumen del pedido</h3>
                  <div className="mt-4 space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Envío</span>
                      <span>${shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Impuestos (21%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-base font-medium text-gray-900 pt-2 border-t border-gray-200 mt-2">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h3 className="text-lg font-medium text-gray-900">¿Qué sigue?</h3>
                  <p className="mt-2 text-gray-600">
                    Recibirás un correo electrónico con los detalles de tu pedido y el envío.
                  </p>
                  <p className="mt-2 text-gray-600">
                    Si tienes alguna pregunta, no dudes en <a href="/contacto" className="text-blue-600 hover:text-blue-800">contactarnos</a>.
                  </p>
                </div>
                
                <div className="mt-10 flex justify-center space-x-4">
                  <Link
                    to="/"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Volver al inicio
                  </Link>
                  <Link
                    to="/mis-compras"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Ver mis pedidos
                  </Link>
                </div>
              </div>
            )}
            
            {currentStep < 4 && (
              <div className="flex justify-between">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Anterior
                  </button>
                ) : (
                  <div></div>
                )}
                
                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Siguiente
                  </button>
                ) : currentStep === 3 ? (
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Procesando pago...
                      </>
                    ) : (
                      'Realizar pedido'
                    )}
                  </button>
                ) : null}
              </div>
            )}
          </div>
          
          {/* Resumen del pedido */}
          <div className="mt-10 lg:mt-0">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg sticky top-4">
              <h2 className="sr-only">Resumen del pedido</h2>
              
              <div className="border-b border-gray-200 px-4 py-5 sm:px-6">
                <h3 className="text-lg font-medium text-gray-900">Resumen del pedido</h3>
              </div>
              
              <div className="px-4 py-5 sm:p-6">
                <ul className="divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <li key={item.id} className="py-4 flex">
                      <div className="flex-shrink-0 h-16 w-16 rounded-md overflow-hidden">
                        <img
                          src={item.image || "https://via.placeholder.com/150"}
                          alt={item.name}
                          className="w-full h-full object-cover object-center"
                          onError={(e) => {
                            e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTJlOGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzY0NzQ4YiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlByb2R1Y3RvPC90ZXh0Pjwvc3ZnPg==";
                          }}
                        />
                      </div>
                      
                      <div className="ml-4 flex-1">
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <h3>{item.name}</h3>
                          <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          Cantidad: {item.quantity}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          ${item.price.toFixed(2)} c/u
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
                
                <div className="border-t border-gray-200 mt-6 pt-6">
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <p>Subtotal</p>
                    <p>${subtotal.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 mt-2">
                    <p>Envío</p>
                    <p>${shipping.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 mt-1">
                    <p>Impuestos (21%)</p>
                    <p>${tax.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between text-lg font-bold mt-4 pt-4 border-t border-gray-200">
                    <p>Total</p>
                    <p>${total.toFixed(2)}</p>
                  </div>
                </div>
                
                {currentStep < 3 && (
                  <div className="mt-6">
                    <p className="text-sm text-gray-500">
                      El envío se calculará en el siguiente paso.
                    </p>
                  </div>
                )}
                
                {currentStep === 3 && (
                  <div className="mt-6">
                    <p className="text-sm text-gray-500">
                      Al realizar el pedido, aceptas nuestros términos y condiciones.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Checkout;
