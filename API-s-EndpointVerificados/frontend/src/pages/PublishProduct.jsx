import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function PublishProduct() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "electronicos",
    image: "",
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const categories = [
    { value: "electronicos", label: "Electrónicos" },
    { value: "ropa", label: "Ropa" },
    { value: "hogar", label: "Hogar" },
    { value: "deportes", label: "Deportes" },
    { value: "libros", label: "Libros" },
    { value: "belleza", label: "Belleza" }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "El nombre es obligatorio";
    if (!form.description.trim()) errs.description = "La descripción es obligatoria";
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) {
      errs.price = "El precio debe ser un número mayor a 0";
    }
    if (!form.stock || isNaN(form.stock) || Number(form.stock) < 0) {
      errs.stock = "El stock debe ser un número mayor o igual a 0";
    }
    if (!form.category) errs.category = "La categoría es obligatoria";
    return errs;
  };

  const generateProductId = () => {
    // Obtener productos existentes para generar un ID único
    const existingProducts = JSON.parse(localStorage.getItem('userProducts') || '[]');
    const maxId = existingProducts.reduce((max, product) => Math.max(max, product.id || 0), 20);
    return maxId + 1;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    setApiError("");
    
    if (Object.keys(errs).length === 0) {
      setLoading(true);
      try {
        // Simular delay de API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Crear nuevo producto
        const newProduct = {
          id: generateProductId(),
          name: form.name.trim(),
          description: form.description.trim(),
          price: Number(form.price),
          stock: Number(form.stock),
          category: form.category,
          image: form.image || "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTJlOGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzY0NzQ4YiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbjwvdGV4dD48L3N2Zz4=",
          seller: user.email,
          sellerName: `${user.name} ${user.surname}`,
          createdAt: new Date().toISOString(),
          status: "active"
        };

        // Guardar en localStorage (productos del usuario)
        const existingProducts = JSON.parse(localStorage.getItem('userProducts') || '[]');
        const updatedProducts = [...existingProducts, newProduct];
        localStorage.setItem('userProducts', JSON.stringify(updatedProducts));

        // También agregar al JSON principal de productos para que aparezca en la búsqueda general
        try {
          // Cargar productos existentes del JSON
          const response = await fetch('/src/data/bs.json');
          let productsData = await response.json();
          
          // Agregar el nuevo producto con formato compatible
          const productForMainList = {
            id: newProduct.id,
            name: newProduct.name,
            description: newProduct.description,
            price: newProduct.price,
            stock: newProduct.stock,
            category: newProduct.category,
            imageUrl: newProduct.image
          };
          
          productsData.products.push(productForMainList);
          
          // Guardar en localStorage como respaldo (ya que no podemos modificar archivos estáticos)
          localStorage.setItem('allProductsData', JSON.stringify(productsData));
        } catch (error) {
          console.log('No se pudo actualizar el JSON principal, pero el producto se guardó correctamente');
        }

        setSuccess(true);
        setForm({ 
          name: "", 
          description: "", 
          price: "", 
          stock: "", 
          category: "electronicos", 
          image: "" 
        });
        
        setTimeout(() => {
          setSuccess(false);
          navigate("/mis-productos");
        }, 2000);
        
      } catch (err) {
        setApiError("Error al publicar producto. Intenta nuevamente.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Vender Producto</h1>
            <p className="text-gray-600">Completa la información de tu producto para publicarlo</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombre del producto */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del producto *
              </label>
              <input
                type="text"
                name="name"
                placeholder="Ej: iPhone 14 Pro Max"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                value={form.name}
                onChange={handleChange}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción *
              </label>
              <textarea
                name="description"
                rows="4"
                placeholder="Describe tu producto, características, estado, etc."
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
                value={form.description}
                onChange={handleChange}
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            {/* Precio y Stock */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Precio *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500">$</span>
                  <input
                    type="number"
                    name="price"
                    placeholder="0"
                    min="1"
                    step="0.01"
                    className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.price ? "border-red-500" : "border-gray-300"
                    }`}
                    value={form.price}
                    onChange={handleChange}
                  />
                </div>
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock disponible *
                </label>
                <input
                  type="number"
                  name="stock"
                  placeholder="0"
                  min="0"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.stock ? "border-red-500" : "border-gray-300"
                  }`}
                  value={form.stock}
                  onChange={handleChange}
                />
                {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
              </div>
            </div>

            {/* Categoría */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría *
              </label>
              <select
                name="category"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.category ? "border-red-500" : "border-gray-300"
                }`}
                value={form.category}
                onChange={handleChange}
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
            </div>

            {/* URL de imagen */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL de imagen (opcional)
              </label>
              <input
                type="url"
                name="image"
                placeholder="https://ejemplo.com/imagen.jpg"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.image}
                onChange={handleChange}
              />
              <p className="text-gray-500 text-sm mt-1">
                Si no proporcionas una imagen, se usará una imagen por defecto
              </p>
            </div>

            {/* Mensajes de error y éxito */}
            {apiError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {apiError}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                ¡Producto publicado exitosamente! Redirigiendo...
              </div>
            )}

            {/* Botones */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Publicando...
                  </div>
                ) : (
                  "Publicar Producto"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PublishProduct;
