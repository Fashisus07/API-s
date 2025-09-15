import React, { useState } from "react";
import authService from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function Register() {
  const [form, setForm] = useState({ 
    name: "", 
    surname: "", 
    dni: "", 
    email: "", 
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
    if (apiError) setApiError("");
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "El nombre es obligatorio";
    if (!form.surname.trim()) errs.surname = "El apellido es obligatorio";
    if (!form.dni) errs.dni = "El DNI es obligatorio";
    else if (!/^\d{7,8}$/.test(form.dni)) errs.dni = "DNI debe tener 7 u 8 dígitos";
    if (!form.email) errs.email = "El email es obligatorio";
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) errs.email = "Email inválido";
    if (!form.password) errs.password = "La contraseña es obligatoria";
    else if (form.password.length < 6) errs.password = "Mínimo 6 caracteres";
    if (form.password !== form.confirmPassword) {
      errs.confirmPassword = "Las contraseñas no coinciden";
    }
    return errs;
  };

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    
    if (Object.keys(errs).length === 0) {
      setIsLoading(true);
      try {
        const res = await authService.register(form);
        login(
          res.data.token, 
          res.data.name, 
          res.data.surname, 
          res.data.email, 
          res.data.username
        );
        setApiError("");
        navigate("/");
      } catch (err) {
        console.error("Registration error:", err);
        setApiError(
          err.response?.data?.error || 
          err.response?.data?.message || 
          "Error al registrar el usuario. Por favor, inténtalo de nuevo."
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-blue-600">Crear una cuenta</h1>
            <button 
              onClick={() => navigate(-1)}
              className="text-gray-600 hover:text-gray-800 transition flex items-center text-sm"
            >
              ← Volver
            </button>
          </div>
          
          {apiError && (
            <div className="mb-4 rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error al registrar</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{apiError}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nombre
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    autoComplete="given-name"
                    className={`block w-full rounded-md shadow-sm ${errors.name ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} sm:text-sm`}
                    value={form.name}
                    onChange={handleChange}
                  />
                  {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="surname" className="block text-sm font-medium text-gray-700">
                  Apellido
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="surname"
                    id="surname"
                    autoComplete="family-name"
                    className={`block w-full rounded-md shadow-sm ${errors.surname ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} sm:text-sm`}
                    value={form.surname}
                    onChange={handleChange}
                  />
                  {errors.surname && <p className="mt-2 text-sm text-red-600">{errors.surname}</p>}
                </div>
              </div>

              <div className="sm:col-span-6 lg:col-span-3">
                <label htmlFor="dni" className="block text-sm font-medium text-gray-700">
                  DNI (sin puntos ni espacios)
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="dni"
                    id="dni"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className={`block w-full rounded-md shadow-sm ${errors.dni ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} sm:text-sm`}
                    value={form.dni}
                    onChange={handleChange}
                  />
                  {errors.dni && <p className="mt-2 text-sm text-red-600">{errors.dni}</p>}
                </div>
              </div>

              <div className="sm:col-span-6 lg:col-span-6">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Correo electrónico
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className={`block w-full rounded-md shadow-sm ${errors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} sm:text-sm`}
                    value={form.email}
                    onChange={handleChange}
                  />
                  {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
                </div>
              </div>

              <div className="sm:col-span-6 lg:col-span-3">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Contraseña
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    className={`block w-full rounded-md shadow-sm ${errors.password ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} sm:text-sm`}
                    value={form.password}
                    onChange={handleChange}
                  />
                  {errors.password ? (
                    <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                  ) : (
                    <p className="mt-2 text-xs text-gray-500">Mínimo 6 caracteres</p>
                  )}
                </div>
              </div>

              <div className="sm:col-span-6 lg:col-span-3">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirmar contraseña
                </label>
                <div className="mt-1">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    className={`block w-full rounded-md shadow-sm ${errors.confirmPassword ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} sm:text-sm`}
                    value={form.confirmPassword}
                    onChange={handleChange}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                required
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                Acepto los <a href="#" className="text-blue-600 hover:text-blue-500">términos y condiciones</a>
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creando cuenta...
                  </>
                ) : 'Crear cuenta'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">¿Ya tienes una cuenta?</span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/login"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Iniciar sesión
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
