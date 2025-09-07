import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Register() {
  const [form, setForm] = useState({ name: "", surname: "", dni: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const errs = {};
    if (!form.name) errs.name = "El nombre es obligatorio";
    if (!form.surname) errs.surname = "El apellido es obligatorio";
    if (!form.dni) errs.dni = "El DNI es obligatorio";
    else if (!/^\d{7,8}$/.test(form.dni)) errs.dni = "DNI debe tener 7 u 8 dígitos";
    if (!form.email) errs.email = "El email es obligatorio";
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) errs.email = "Email inválido";
    if (!form.password) errs.password = "La contraseña es obligatoria";
    else if (form.password.length < 6) errs.password = "Mínimo 6 caracteres";
    return errs;
  };

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      try {
        const res = await api.post("/auth/register", form);
        login(res.data.token, res.data.name, res.data.surname, res.data.email, res.data.dni, res.data.profilePhoto);
        setApiError("");
        navigate("/products");
      } catch (err) {
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
