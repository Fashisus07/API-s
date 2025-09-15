import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function PerfilUser() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  // Cargar datos del perfil al montar el componente
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // Simular carga de datos del perfil
    const loadProfile = async () => {
      setLoading(true);
      try {
        // Simular llamada a la API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Obtener datos del usuario del localStorage
        const savedProfile = localStorage.getItem('userProfile');
        const profileData = savedProfile 
          ? JSON.parse(savedProfile)
          : {
              firstName: user?.firstName || "",
              lastName: user?.lastName || "",
              email: user?.email || "",
              phone: "",
              address: "",
              city: "",
              state: "",
              zipCode: "",
              country: "Argentina"
            };
        
        setFormData(profileData);
      } catch (error) {
        console.error("Error al cargar el perfil:", error);
        setMessage("Error al cargar el perfil. Por favor, intenta de nuevo.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [isAuthenticated, navigate, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simular llamada a la API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Guardar en localStorage (simulando base de datos)
      localStorage.setItem('userProfile', JSON.stringify(formData));
      
      setMessage("Perfil actualizado correctamente.");
      setIsEditing(false);
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      setMessage("Error al actualizar el perfil. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (loading && !isEditing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando tu perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200">
            <div>
              <h3 className="text-2xl leading-6 font-medium text-gray-900">
                Perfil de Usuario
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Gestiona la información de tu cuenta y preferencias.
              </p>
            </div>
            <div className="flex space-x-3">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Editar Perfil
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsEditing(false);
                    // Recargar datos originales
                    const savedProfile = localStorage.getItem('userProfile');
                    if (savedProfile) {
                      setFormData(JSON.parse(savedProfile));
                    }
                  }}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancelar
                </button>
              )}
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
          
          {message && (
            <div className={`p-4 ${message.includes("Error") ? 'bg-red-50' : 'bg-green-50'} border-l-4 ${message.includes("Error") ? 'border-red-400' : 'border-green-400'}`}>
              <div className="flex">
                <div className="flex-shrink-0">
                  {message.includes("Error") ? (
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="ml-3">
                  <p className={`text-sm ${message.includes("Error") ? 'text-red-700' : 'text-green-700'}`}>
                    {message}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="divide-y divide-gray-200">
            <div className="px-4 py-5 sm:p-6">
              <div className="space-y-6">
                <div className="md:grid md:grid-cols-3 md:gap-6">
                  <div className="md:col-span-1">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Información Personal</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Esta información se mostrará en tu perfil público.
                    </p>
                  </div>
                  <div className="mt-5 md:mt-0 md:col-span-2">
                    <div className="grid grid-cols-6 gap-6">
                      <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                          Nombre
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="firstName"
                            id="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            required
                          />
                        ) : (
                          <p className="mt-1 text-sm text-gray-900">{formData.firstName || 'No especificado'}</p>
                        )}
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                          Apellido
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="lastName"
                            id="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            required
                          />
                        ) : (
                          <p className="mt-1 text-sm text-gray-900">{formData.lastName || 'No especificado'}</p>
                        )}
                      </div>

                      <div className="col-span-6 sm:col-span-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          Correo electrónico
                        </label>
                        {isEditing ? (
                          <input
                            type="email"
                            name="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            required
                          />
                        ) : (
                          <p className="mt-1 text-sm text-gray-900">{formData.email || 'No especificado'}</p>
                        )}
                      </div>

                      <div className="col-span-6 sm:col-span-4">
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                          Teléfono
                        </label>
                        {isEditing ? (
                          <input
                            type="tel"
                            name="phone"
                            id="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        ) : (
                          <p className="mt-1 text-sm text-gray-900">{formData.phone || 'No especificado'}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-4 py-5 sm:p-6">
              <div className="space-y-6">
                <div className="md:grid md:grid-cols-3 md:gap-6">
                  <div className="md:col-span-1">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Dirección</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Tu dirección de envío principal.
                    </p>
                  </div>
                  <div className="mt-5 md:mt-0 md:col-span-2">
                    <div className="grid grid-cols-6 gap-6">
                      <div className="col-span-6">
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                          Dirección
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="address"
                            id="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        ) : (
                          <p className="mt-1 text-sm text-gray-900">{formData.address || 'No especificada'}</p>
                        )}
                      </div>

                      <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                          Ciudad
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="city"
                            id="city"
                            value={formData.city}
                            onChange={handleChange}
                            className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        ) : (
                          <p className="mt-1 text-sm text-gray-900">{formData.city || 'No especificada'}</p>
                        )}
                      </div>

                      <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                          Provincia
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="state"
                            id="state"
                            value={formData.state}
                            onChange={handleChange}
                            className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        ) : (
                          <p className="mt-1 text-sm text-gray-900">{formData.state || 'No especificada'}</p>
                        )}
                      </div>

                      <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                        <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                          Código Postal
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="zipCode"
                            id="zipCode"
                            value={formData.zipCode}
                            onChange={handleChange}
                            className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        ) : (
                          <p className="mt-1 text-sm text-gray-900">{formData.zipCode || 'No especificado'}</p>
                        )}
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                          País
                        </label>
                        {isEditing ? (
                          <select
                            id="country"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          >
                            <option value="">Seleccionar país</option>
                            <option value="Argentina">Argentina</option>
                            <option value="Uruguay">Uruguay</option>
                            <option value="Chile">Chile</option>
                            <option value="Brasil">Brasil</option>
                            <option value="Paraguay">Paraguay</option>
                            <option value="Bolivia">Bolivia</option>
                            <option value="Perú">Perú</option>
                            <option value="Ecuador">Ecuador</option>
                            <option value="Colombia">Colombia</option>
                            <option value="Venezuela">Venezuela</option>
                            <option value="México">México</option>
                            <option value="España">España</option>
                            <option value="Estados Unidos">Estados Unidos</option>
                            <option value="Otro">Otro</option>
                          </select>
                        ) : (
                          <p className="mt-1 text-sm text-gray-900">{formData.country || 'No especificado'}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Guardando...
                    </>
                  ) : 'Guardar Cambios'}
                </button>
              </div>
            )}
          </form>
        </div>
        
        {/* Sección de acciones de cuenta */}
        <div className="mt-10 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Acciones de la Cuenta
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Gestiona la configuración de tu cuenta.
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Cambiar contraseña
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <button
                    onClick={() => navigate("/cambiar-contrasena")}
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Haz clic aquí para cambiar tu contraseña
                  </button>
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Eliminar cuenta
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <button
                    onClick={() => alert("Función de eliminación de cuenta no implementada")}
                    className="font-medium text-red-600 hover:text-red-500"
                  >
                    Eliminar permanentemente mi cuenta
                  </button>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PerfilUser;
