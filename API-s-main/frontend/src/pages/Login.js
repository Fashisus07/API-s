import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
      try {
        const res = await api.post("/auth/login", form);
        login(res.data.token, res.data.name || form.email);
        setApiError("");
        navigate("/products");
      } catch (err) {
        setApiError(
          err.response?.data?.error || err.response?.data?.message || "Credenciales incorrectas o error de red"
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-accent">Iniciar sesión</h1>
            <button 
              onClick={() => navigate(-1)}
              className="text-secondary hover:text-primary transition flex items-center text-sm"
            >
              ← Volver
            </button>
          </div>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
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
          Ingresar
        </button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          ¿No tienes cuenta?{' '}
          <button 
            onClick={() => navigate('/register')}
            className="text-primary hover:text-primary-dark font-medium"
          >
            Regístrate aquí
          </button>
        </p>
      </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
