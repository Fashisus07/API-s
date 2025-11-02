// Importar React y hooks necesarios para el componente de registro
import React, { useState } from "react";
import authService from "../services/authService"; // Servicio para autenticación
import { useNavigate } from "react-router-dom"; // Hook para navegación programática
import { useAuth } from "../context/AuthContext"; // Contexto de autenticación

// Componente Register - Página de registro de nuevos usuarios
function Register() {
  const [form, setForm] = useState({ name: "", surname: "", dni: "", email: "", password: "" }); // Estado del formulario
  const [errors, setErrors] = useState({}); // Estado para errores de validación
  const [apiError, setApiError] = useState(""); // Estado para errores de la API

  // Función para manejar cambios en los campos del formulario
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value }); // Actualizar campo específico
  };

  // Función para validar los datos del formulario
  const validate = () => {
    const errs = {};
    if (!form.name) errs.name = "El nombre es obligatorio"; // Validar nombre requerido
    if (!form.surname) errs.surname = "El apellido es obligatorio"; // Validar apellido requerido
    if (!form.dni) errs.dni = "El DNI es obligatorio"; // Validar DNI requerido
    else if (!/^\d{7,8}$/.test(form.dni)) errs.dni = "DNI debe tener 7 u 8 dígitos"; // Validar formato de DNI
    if (!form.email) errs.email = "El email es obligatorio"; // Validar email requerido
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) errs.email = "Email inválido"; // Validar formato de email
    if (!form.password) errs.password = "La contraseña es obligatoria"; // Validar contraseña requerida
    else if (form.password.length < 6) errs.password = "Mínimo 6 caracteres"; // Validar longitud mínima
    return errs; // Retornar objeto con errores
  };

  const navigate = useNavigate(); // Hook para navegación
  const { login } = useAuth(); // Función de login del contexto

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevenir comportamiento por defecto del formulario
    const errs = validate(); // Validar formulario
    setErrors(errs); // Establecer errores de validación
    if (Object.keys(errs).length === 0) { // Si no hay errores de validación
      try {
        // Intentar registrar usuario con el servicio de autenticación
        const res = await authService.register(form);
        // Iniciar sesión automáticamente después del registro exitoso
        login(res.data.token, res.data.name, res.data.surname, res.data.email, res.data.dni, res.data.username);
        setApiError(""); // Limpiar errores de API
        navigate("/"); // Navegar a la página principal
      } catch (err) {
        // Manejar errores de registro
        setApiError(
          err.response?.data?.error || err.response?.data?.message || "Error al registrar usuario"
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-accent">Registro</h1>
            <button
              onClick={() => navigate(-1)}
              className="text-secondary hover:text-primary transition flex items-center text-sm"
            >
              ← Volver
            </button>
          </div>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
            <input
              type="text"
              name="name"
              placeholder="Nombre"
              className={`p-2 border rounded ${errors.name ? "border-red-500" : "border-primary/40"}`}
              value={form.name}
              onChange={handleChange}
            />
            {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
            <input
              type="text"
              name="surname"
              placeholder="Apellido"
              className={`p-2 border rounded ${errors.surname ? "border-red-500" : "border-primary/40"}`}
              value={form.surname}
              onChange={handleChange}
            />
            {errors.surname && <span className="text-red-500 text-sm">{errors.surname}</span>}
            <input
              type="text"
              name="dni"
              placeholder="DNI (sin puntos ni espacios)"
              className={`p-2 border rounded ${errors.dni ? "border-red-500" : "border-primary/40"}`}
              value={form.dni}
              onChange={handleChange}
            />
            {errors.dni && <span className="text-red-500 text-sm">{errors.dni}</span>}
            <input
              type="email"
              name="email"
              placeholder="Email"
              className={`p-2 border rounded ${errors.email ? "border-red-500" : "border-primary/40"}`}
              value={form.email}
              onChange={handleChange}
            />
            {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              className={`p-2 border rounded ${errors.password ? "border-red-500" : "border-primary/40"}`}
              value={form.password}
              onChange={handleChange}
            />
            {errors.password && <span className="text-red-500 text-sm">{errors.password}</span>}
            {apiError && <div className="text-red-500 text-sm bg-red-50 p-2 rounded border border-red-200">{apiError}</div>}
            <button className="w-full bg-primary text-white font-semibold py-2 px-4 rounded hover:bg-primary-dark transition">
              Registrarse
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes cuenta?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-primary hover:text-primary-dark font-medium"
              >
                Inicia sesión aquí
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
