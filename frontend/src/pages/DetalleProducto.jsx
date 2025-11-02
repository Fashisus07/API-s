// Importar React y hooks necesarios para la página de detalle de producto
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom"; // Hooks para parámetros de ruta y navegación
import { useAuth } from "../context/AuthContext"; // Contexto de autenticación
import { useCart } from "../context/CartContext"; // Contexto del carrito
import productsData from "../data/bs.json"; // Datos de productos desde archivo JSON

// Componente DetalleProducto - Página de detalle individual de un producto
function DetalleProducto() {
  const { id } = useParams(); // Obtener ID del producto desde los parámetros de la URL
  const navigate = useNavigate(); // Hook para navegación programática
  const { isAuthenticated } = useAuth(); // Verificar si el usuario está autenticado
  const { addToCart, isInCart, getProductQuantity } = useCart(); // Funciones del carrito
  const [product, setProduct] = useState(null); // Estado para el producto actual
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(""); // Estado para errores
  const [quantity, setQuantity] = useState(1); // Estado para cantidad seleccionada
  const [addingToCart, setAddingToCart] = useState(false); // Estado para operación de agregar al carrito
  const [message, setMessage] = useState(""); // Estado para mensajes de feedback
  const [relatedProducts, setRelatedProducts] = useState([]); // Estado para productos relacionados

  // useEffect para cargar el producto al montar el componente
  useEffect(() => {
    const loadProduct = () => {
      try {
        console.log("Loading product with ID:", id);
        console.log("Available products:", productsData.products.length);

        // Buscar el producto por ID en los datos
        const foundProduct = productsData.products.find(p => p.id === parseInt(id));
        console.log("Found product:", foundProduct);

        if (foundProduct) {
          setProduct(foundProduct); // Establecer producto encontrado
          // Obtener productos relacionados de la misma categoría (excluyendo el actual)
          const related = productsData.products
            .filter(p => p.category === foundProduct.category && p.id !== foundProduct.id)
            .slice(0, 4); // Limitar a 4 productos relacionados
          console.log("Related products:", related);
          setRelatedProducts(related); // Establecer productos relacionados
          setError(""); // Limpiar errores
        } else {
          setError("Producto no encontrado"); // Mostrar error si no se encuentra
          console.error("Product not found for ID:", id);
        }
      } catch (err) {
        console.error("Error loading product:", err);
        setError("Error al cargar el producto"); // Mostrar error genérico
      } finally {
        setLoading(false); // Finalizar estado de carga
      }
    };

    loadProduct(); // Ejecutar función de carga
  }, [id]);

  const handleAddToCart = async () => {
    if (quantity > product.stock) {
      setMessage("No hay suficiente stock disponible");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    setAddingToCart(true);
    try {
      addToCart(product, quantity);
      setMessage(`¡${quantity} ${product.name}(s) agregado(s) al carrito!`);
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("Error al agregar al carrito");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = () => {
    // Agregar al carrito y redirigir (PrivateRoute maneja la autenticación)
    addToCart(product, quantity);
    navigate("/carrito");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Producto no encontrado</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            to="/productos"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Ver todos los productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-blue-600">Inicio</Link>
            <span>›</span>
            <Link to="/productos" className="hover:text-blue-600">Productos</Link>
            <span>›</span>
            <span className="text-gray-800">{product.name}</span>
          </div>
        </nav>

        {/* Product Details */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div className="space-y-4">
              <img
                src={product.imageUrl || product.image}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg border border-gray-200"
                onError={(e) => {
                  e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTJlOGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCIgZmlsbD0iIzY0NzQ4YiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlByb2R1Y3RvPC90ZXh0Pjwvc3ZnPg==";
                }}
              />
              <div className="grid grid-cols-4 gap-2">
                {[...Array(4)].map((_, i) => (
                  <img
                    key={i}
                    src={product.imageUrl || product.image}
                    alt={`${product.name} ${i + 1}`}
                    className="w-full h-20 object-cover rounded border border-gray-200 cursor-pointer hover:border-blue-600"
                    onError={(e) => {
                      e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTJlOGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzY0NzQ4YiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPklNRzwvdGV4dD48L3N2Zz4=";
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
                <p className="text-gray-600">{product.description}</p>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-blue-600">${product.price}</span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {product.stock > 0 ? `${product.stock} disponibles` : 'Sin stock'}
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label className="font-medium text-gray-700">Cantidad:</label>
                  <div className="flex items-center border border-gray-300 rounded">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 hover:bg-gray-100"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-3 py-2 hover:bg-gray-100"
                      disabled={quantity >= product.stock}
                    >
                      +
                    </button>
                  </div>
                </div>

                {message && (
                  <div className={`p-3 rounded-lg text-sm ${message.includes("Error") || message.includes("Debes") || message.includes("suficiente")
                      ? "bg-red-100 text-red-700 border border-red-300"
                      : "bg-green-100 text-green-700 border border-green-300"
                    }`}>
                    {message}
                  </div>
                )}

                <div className="space-y-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0 || addingToCart}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {addingToCart ? "Agregando..." : "🛒 Agregar al carrito"}
                  </button>

                  <button
                    onClick={handleBuyNow}
                    disabled={product.stock === 0}
                    className="w-full bg-orange-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    💳 Comprar ahora
                  </button>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-800 mb-3">Información del producto</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Categoría:</span>
                    <span className="font-medium">{product.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Stock disponible:</span>
                    <span className="font-medium">{product.stock} unidades</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Envío:</span>
                    <span className="font-medium text-green-600">Gratis</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Productos relacionados</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  to={`/producto/${relatedProduct.id}`}
                  className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <img
                    src={relatedProduct.imageUrl || relatedProduct.image}
                    alt={relatedProduct.name}
                    className="w-full h-40 object-cover rounded mb-3"
                    onError={(e) => {
                      e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTJlOGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCIgZmlsbD0iIzY0NzQ4YiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlByb2R1Y3RvPC90ZXh0Pjwvc3ZnPg==";
                    }}
                  />
                  <h3 className="font-semibold text-gray-800 mb-1">{relatedProduct.name}</h3>
                  <p className="text-blue-600 font-bold">${relatedProduct.price}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Volver
          </button>
        </div>
      </div>
    </div>
  );
}

export default DetalleProducto;
