import React, { useState } from "react";
import authService from "../services/authService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
    if (apiError) setApiError("");
  };

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = "El email es obligatorio";
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) errs.email = "Email inválido";
    if (!form.password) errs.password = "La contraseña es obligatoria";
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
        const res = await authService.login(form.email, form.password);
        login(
          res.data.token, 
          res.data.name, 
          res.data.surname, 
          res.data.email, 
          res.data.username
        );
        setApiError("");
        
        // Verificar si hay una URL de redirección pendiente
        const redirectPath = localStorage.getItem('redirectAfterLogin');
        if (redirectPath) {
          localStorage.removeItem('redirectAfterLogin');
          navigate(redirectPath);
        } else {
          navigate("/");
        }
      } catch (err) {
        setApiError(
          err.response?.data?.error || 
          err.response?.data?.message || 
          "Error al iniciar sesión. Por favor, inténtalo de nuevo."
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
            <h1 className="text-2xl font-bold text-blue-600">Iniciar sesión</h1>
            <button 
              onClick={() => navigate(-1)}
              className="text-gray-600 hover:text-gray-800 transition flex items-center text-sm"
            >
              ← Volver
            </button>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Correo electrónico
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className={`appearance-none block w-full px-3 py-2 border ${errors.email ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  value={form.email}
                  onChange={handleChange}
                />
                {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  className={`appearance-none block w-full px-3 py-2 border ${errors.password ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  value={form.password}
                  onChange={handleChange}
                />
                {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password}</p>}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Recordarme
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            </div>

            {apiError && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error al iniciar sesión</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{apiError}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

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
                    Iniciando sesión...
                  </>
                ) : 'Iniciar sesión'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">¿No tienes una cuenta?</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Regístrate
              </button>
            </div>
          </div>
        </div>

        {/* Usuarios de prueba */}
        <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="text-sm font-medium text-blue-800 mb-2">👤 Usuarios de prueba:</h3>
          <ul className="text-xs text-blue-700 space-y-1">
            <li><strong>Admin:</strong> admin@ecommerce.com / admin123</li>
            <li><strong>Usuario:</strong> usuario1@email.com / password123</li>
            <li><strong>María:</strong> maria.garcia@email.com / maria2024</li>
            <li><strong>Carlos:</strong> carlos.lopez@email.com / carlos456</li>
            <li><strong>Ana:</strong> ana.martinez@email.com / ana789</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Login;
