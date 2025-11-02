import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

function PublishProduct() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    image: null,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({
      ...form,
      [name]: files ? files[0] : value,
    });
  };

  const validate = () => {
    const errs = {};
    if (!form.name) errs.name = "El nombre es obligatorio";
    if (!form.description) errs.description = "La descripción es obligatoria";
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) errs.price = "Precio inválido";
    if (!form.stock || isNaN(form.stock) || Number(form.stock) < 0) errs.stock = "Stock inválido";
    if (!form.category) errs.category = "La categoría es obligatoria";
    // Imagen opcional
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      try {
        await api.post("/products", {
          name: form.name,
          description: form.description,
          price: Number(form.price),
          stock: Number(form.stock),
          category: form.category,
          // image: form.image // (bonus: implementar upload)
        });
        setApiError("");
        setSuccess(true);
        setForm({ name: "", description: "", price: "", stock: "", category: "", image: null });
        setTimeout(() => setSuccess(false), 3000);
        // Opcional: navigate("/products");
      } catch (err) {
        setApiError(err.response?.data?.message || "Error al publicar producto");
        setSuccess(false);
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-8 bg-white p-8 rounded shadow border border-primary/30">
      <h1 className="text-2xl font-bold mb-4 text-accent">Publicar producto</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
        <input
          type="text"
          name="name"
          placeholder="Nombre del producto"
          className={`p-2 border rounded ${errors.name ? "border-red-500" : "border-primary/40"}`}
          value={form.name}
          onChange={handleChange}
        />
        {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
        <textarea
          name="description"
          placeholder="Descripción"
          className={`p-2 border rounded ${errors.description ? "border-red-500" : "border-primary/40"}`}
          value={form.description}
          onChange={handleChange}
        />
        {errors.description && <span className="text-red-500 text-sm">{errors.description}</span>}
        <input
          type="number"
          name="price"
          placeholder="Precio"
          className={`p-2 border rounded ${errors.price ? "border-red-500" : "border-primary/40"}`}
          value={form.price}
          onChange={handleChange}
        />
        {errors.price && <span className="text-red-500 text-sm">{errors.price}</span>}
        <input
          type="number"
          name="stock"
          placeholder="Stock"
          className={`p-2 border rounded ${errors.stock ? "border-red-500" : "border-primary/40"}`}
          value={form.stock}
          onChange={handleChange}
        />
        {errors.stock && <span className="text-red-500 text-sm">{errors.stock}</span>}
        <input
          type="text"
          name="category"
          placeholder="Categoría"
          className={`p-2 border rounded ${errors.category ? "border-red-500" : "border-primary/40"}`}
          value={form.category}
          onChange={handleChange}
        />
        {errors.category && <span className="text-red-500 text-sm">{errors.category}</span>}
        <input
          type="file"
          name="image"
          className="p-2 border border-primary/40 rounded"
          onChange={handleChange}
        />
        {apiError && <div className="text-red-500 text-sm bg-red-50 p-2 rounded border border-red-200">{apiError}</div>}
        {success && <div className="text-green-700 text-sm bg-green-50 p-2 rounded border border-green-200">¡Producto publicado exitosamente!</div>}
        <button className="bg-primary text-secondary font-semibold py-2 rounded hover:bg-primary-dark border border-secondary">Publicar</button>
      </form>
    </div>
  );
}

export default PublishProduct;
