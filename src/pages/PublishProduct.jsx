import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function PublishProduct() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    condition: "new",
    stock: 1,
    images: [],
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [success, setSuccess] = useState(false);

  const categories = [
    "Electrónica",
    "Ropa y Accesorios",
    "Hogar",
    "Deportes",
    "Juguetes",
    "Libros",
    "Música",
    "Cine",
    "Videojuegos",
    "Otros"
  ];

  const conditions = [
    { value: "new", label: "Nuevo" },
    { value: "like_new", label: "Como nuevo" },
    { value: "good", label: "Buen estado" },
    { value: "fair", label: "Aceptable" },
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.name.trim()) newErrors.name = "El nombre es obligatorio";
    if (!form.description.trim()) newErrors.description = "La descripción es obligatoria";
    if (!form.price || Number(form.price) <= 0) newErrors.price = "El precio debe ser mayor a 0";
    if (!form.category) newErrors.category = "Debes seleccionar una categoría";
    if (form.images.length === 0) newErrors.images = "Debes subir al menos una imagen";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + form.images.length > 5) {
      setErrors({
        ...errors,
        images: "No puedes subir más de 5 imágenes"
      });
      return;
    }
    
    const newImages = files.map(file => URL.createObjectURL(file));
    setPreviewImages([...previewImages, ...newImages]);
    
    setForm({
      ...form,
      images: [...form.images, ...files]
    });
    
    if (errors.images) {
      setErrors({
        ...errors,
        images: ""
      });
    }
  };

  const removeImage = (index) => {
    const newImages = [...form.images];
    const newPreviews = [...previewImages];
    
    // Revoke the object URL to prevent memory leaks
    URL.revokeObjectURL(newPreviews[index]);
    
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setForm({
      ...form,
      images: newImages
    });
    
    setPreviewImages(newPreviews);
  };

  const handleNextStep = () => {
    if (currentStep === 1 && !validateForm()) return;
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Simular llamada a la API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Obtener productos existentes
      const existingProducts = JSON.parse(localStorage.getItem('products') || '[]');
      
      // Crear nuevo producto
      const newProduct = {
        id: Date.now().toString(),
        ...form,
        sellerId: user.id,
        sellerName: user.firstName,
        createdAt: new Date().toISOString(),
        status: 'active',
        rating: 0,
        reviews: [],
        image: previewImages[0] || 'https://via.placeholder.com/300',
      };
      
      // Guardar en localStorage
      localStorage.setItem('products', JSON.stringify([...existingProducts, newProduct]));
      
      // Limpiar el formulario
      setForm({
        name: "",
        description: "",
        price: "",
        category: "",
        condition: "new",
        stock: 1,
        images: [],
      });
      setPreviewImages([]);
      setErrors({});
      setSuccess(true);
      
      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate('/mis-productos');
      }, 2000);
      
    } catch (error) {
      console.error("Error al publicar el producto:", error);
      setErrors({
        ...errors,
        submit: "Ocurrió un error al publicar el producto. Por favor, inténtalo de nuevo."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Información básica</h3>
        <p className="mt-1 text-sm text-gray-500">
          Proporciona la información básica sobre tu producto.
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        <div className="sm:col-span-6">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nombre del producto *
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="name"
              id="name"
              value={form.name}
              onChange={handleInputChange}
              className={`block w-full rounded-md shadow-sm ${errors.name ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} sm:text-sm`}
              placeholder="Ej: iPhone 13 Pro Max 256GB"
            />
            {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
          </div>
        </div>

        <div className="sm:col-span-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Descripción *
          </label>
          <div className="mt-1">
            <textarea
              id="description"
              name="description"
              rows={4}
              value={form.description}
              onChange={handleInputChange}
              className={`block w-full rounded-md shadow-sm ${errors.description ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} sm:text-sm`}
              placeholder="Describe detalladamente tu producto..."
            />
            {errors.description && <p className="mt-2 text-sm text-red-600">{errors.description}</p>}
          </div>
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Categoría *
          </label>
          <div className="mt-1">
            <select
              id="category"
              name="category"
              value={form.category}
              onChange={handleInputChange}
              className={`block w-full rounded-md shadow-sm ${errors.category ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} sm:text-sm`}
            >
              <option value="">Selecciona una categoría</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && <p className="mt-2 text-sm text-red-600">{errors.category}</p>}
          </div>
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="condition" className="block text-sm font-medium text-gray-700">
            Estado
          </label>
          <div className="mt-1">
            <select
              id="condition"
              name="condition"
              value={form.condition}
              onChange={handleInputChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              {conditions.map((condition) => (
                <option key={condition.value} value={condition.value}>
                  {condition.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Precio y disponibilidad</h3>
        <p className="mt-1 text-sm text-gray-500">
          Establece el precio y la cantidad disponible de tu producto.
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Precio (USD) *
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              name="price"
              id="price"
              min="0"
              step="0.01"
              value={form.price}
              onChange={handleInputChange}
              className={`block w-full pl-7 pr-12 sm:text-sm rounded-md ${errors.price ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`}
              placeholder="0.00"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm" id="price-currency">
                USD
              </span>
            </div>
          </div>
          {errors.price && <p className="mt-2 text-sm text-red-600">{errors.price}</p>}
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
            Cantidad disponible
          </label>
          <div className="mt-1">
            <input
              type="number"
              name="stock"
              id="stock"
              min="1"
              value={form.stock}
              onChange={handleInputChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Imágenes del producto</h3>
        <p className="mt-1 text-sm text-gray-500">
          Sube imágenes de alta calidad de tu producto. La primera imagen será la principal.
        </p>
      </div>
      
      <div>
        <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md ${errors.images ? 'border-red-300' : 'border-gray-300'}`}>
          <div className="space-y-1 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
              >
                <span>Sube archivos</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
              <p className="pl-1">o arrástralos aquí</p>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, GIF hasta 10MB</p>
          </div>
        </div>
        {errors.images && <p className="mt-2 text-sm text-red-600">{errors.images}</p>}
        
        {previewImages.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Vista previa de imágenes ({previewImages.length}/5)</h4>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {previewImages.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`Vista previa ${index + 1}`}
                    className="h-32 w-full object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  {index === 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-blue-500 text-white text-xs text-center py-0.5">
                      Principal
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderStepIndicator = () => (
    <div className="hidden sm:block">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Progress">
          <button
            onClick={() => setCurrentStep(1)}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              currentStep === 1
                ? 'border-blue-500 text-blue-600'
                : currentStep > 1
                ? 'border-green-500 text-green-600 hover:text-green-700 hover:border-green-700'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <span className={`flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full ${
                currentStep === 1
                  ? 'bg-blue-100 border-2 border-blue-600'
                  : currentStep > 1
                  ? 'bg-green-100 border-2 border-green-600'
                  : 'border-2 border-gray-300'
              }`}>
                {currentStep > 1 ? (
                  <svg className="h-4 w-4 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <span className={currentStep === 1 ? 'text-blue-600' : 'text-gray-600'}>1</span>
                )}
              </span>
              <span className="ml-2">Información básica</span>
            </div>
          </button>

          <button
            onClick={() => currentStep > 1 && setCurrentStep(2)}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              currentStep === 2
                ? 'border-blue-500 text-blue-600'
                : currentStep > 2
                ? 'border-green-500 text-green-600 hover:text-green-700 hover:border-green-700'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            disabled={currentStep < 2}
          >
            <div className="flex items-center">
              <span className={`flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full ${
                currentStep === 2
                  ? 'bg-blue-100 border-2 border-blue-600'
                  : currentStep > 2
                  ? 'bg-green-100 border-2 border-green-600'
                  : 'border-2 border-gray-300'
              }`}>
                {currentStep > 2 ? (
                  <svg className="h-4 w-4 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <span className={currentStep === 2 ? 'text-blue-600' : 'text-gray-600'}>2</span>
                )}
              </span>
              <span className="ml-2">Precio y stock</span>
            </div>
          </button>

          <button
            onClick={() => currentStep > 2 && setCurrentStep(3)}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              currentStep === 3
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            disabled={currentStep < 3}
          >
            <div className="flex items-center">
              <span className={`flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full ${
                currentStep === 3 ? 'bg-blue-100 border-2 border-blue-600' : 'border-2 border-gray-300'
              }`}>
                <span className={currentStep === 3 ? 'text-blue-600' : 'text-gray-600'}>3</span>
              </span>
              <span className="ml-2">Imágenes</span>
            </div>
          </button>
        </nav>
      </div>
    </div>
  );

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="mt-3 text-2xl font-bold text-gray-900">¡Producto publicado con éxito!</h2>
            <p className="mt-2 text-sm text-gray-600">
              Tu producto ha sido publicado correctamente y ya está disponible para la venta.
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => navigate('/mis-productos')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Ver mis productos
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Publicar un nuevo producto</h1>
          <p className="mt-2 text-sm text-gray-600">
            Completa la información requerida para publicar tu producto en la plataforma.
          </p>
        </div>

        {renderStepIndicator()}

        <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <form onSubmit={handleSubmit}>
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}

              {errors.submit && (
                <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-400">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{errors.submit}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-8 pt-5 border-t border-gray-200 flex justify-between">
                <div>
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={handlePreviousStep}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Anterior
                    </button>
                  )}
                </div>
                <div>
                  {currentStep < 3 ? (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Siguiente
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Publicando...
                        </>
                      ) : 'Publicar producto'}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PublishProduct;
