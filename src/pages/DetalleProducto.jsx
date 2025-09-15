import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import productsData from "../data/bs.json";

function DetalleProducto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [message, setMessage] = useState("");
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Cargar el producto y productos relacionados
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        
        // Buscar en los productos del JSON
        let foundProduct = productsData.products.find(p => p.id === parseInt(id));
        
        // Si no se encuentra, buscar en localStorage (productos de usuario)
        if (!foundProduct) {
          const userProducts = JSON.parse(localStorage.getItem('userProducts') || '[]');
          foundProduct = userProducts.find(p => p.id === id);
        }
        
        if (foundProduct) {
          setProduct(foundProduct);
          
          // Cargar productos relacionados de la misma categoría
          const related = productsData.products
            .filter(p => p.category === foundProduct.category && p.id !== foundProduct.id)
            .slice(0, 4);
          setRelatedProducts(related);
          
          // Si hay imágenes, establecer la primera como seleccionada
          if (foundProduct.images && foundProduct.images.length > 0) {
            setSelectedImage(0);
          }
        } else {
          setError("Producto no encontrado");
        }
      } catch (err) {
        console.error("Error al cargar el producto:", err);
        setError("Error al cargar el producto. Por favor, inténtalo de nuevo.");
      } finally {
        setLoading(false);
      }
    };
    
    loadProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!isAuthenticated()) {
      navigate("/login", { state: { from: `/producto/${id}` } });
      return;
    }
    
    if (quantity < 1 || quantity > product.stock) {
      setMessage(`Por favor, ingresa una cantidad entre 1 y ${product.stock}`);
      return;
    }
    
    setIsAddingToCart(true);
    
    try {
      addToCart(product, quantity);
      setMessage(`¡${quantity} ${quantity === 1 ? 'producto' : 'productos'} agregado${quantity > 1 ? 's' : ''} al carrito!`);
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (err) {
      setMessage("Error al agregar al carrito. Intenta de nuevo.");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1) {
      setQuantity(Math.min(value, product?.stock || 1));
    }
  };

  const incrementQuantity = () => {
    if (quantity < (product?.stock || 1)) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-6 bg-red-100 rounded-lg">
          <p className="text-red-700">{error}</p>
          <button 
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Volver atrás
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Producto no encontrado</h2>
          <button
            onClick={() => navigate('/productos')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Ver todos los productos
          </button>
        </div>
      </div>
    );
  }

  const images = product.images || [product.image || product.imageUrl || ""];
  const hasMultipleImages = images.length > 1;
  const isOutOfStock = product.stock === 0;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <div className="flex items-center">
                <Link to="/" className="text-gray-400 hover:text-gray-500">
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <Link to="/productos" className="ml-2 text-sm font-medium text-gray-500 hover:text-gray-700">
                  Productos
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="ml-2 text-sm font-medium text-gray-500">
                  {product.name}
                </span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Product Details */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <div className="lg:grid lg:grid-cols-2 lg:gap-8">
              {/* Product Images */}
              <div className="lg:col-span-1">
                <div className="mb-4">
                  <img
                    src={images[selectedImage]}
                    alt={product.name}
                    className="w-full h-96 object-contain rounded-lg"
                    onError={(e) => {
                      e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTJlOGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzY0NzQ4YiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlByb2R1Y3RvPC90ZXh0Pjwvc3ZnPg==";
                    }}
                  />
                </div>
                
                {hasMultipleImages && (
                  <div className="grid grid-cols-4 gap-2">
                    {images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`border-2 rounded-md overflow-hidden ${selectedImage === index ? 'border-blue-500' : 'border-transparent'}`}
                      >
                        <img
                          src={img}
                          alt={`Vista ${index + 1} de ${product.name}`}
                          className="h-20 w-full object-cover"
                          onError={(e) => {
                            e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTJlOGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzY0NzQ4YiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlByb2R1Y3RvPC90ZXh0Pjwvc3ZnPg==";
                          }}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="lg:col-span-1 mt-8 lg:mt-0 lg:pl-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`h-5 w-5 ${star <= (product.rating || 4) ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-500">
                    ({product.reviewCount || 'Sin'} reseñas)
                  </span>
                </div>
                
                <p className="text-3xl font-bold text-gray-900 mb-6">${product.price}</p>
                
                <div className="mb-6">
                  <p className="text-sm text-gray-500 mb-1">Disponibilidad:</p>
                  <p className={`text-lg font-medium ${isOutOfStock ? 'text-red-600' : 'text-green-600'}`}>
                    {isOutOfStock ? 'Agotado' : 'En stock'}
                  </p>
                  {!isOutOfStock && (
                    <p className="text-sm text-gray-500 mt-1">
                      {product.stock} {product.stock === 1 ? 'unidad' : 'unidades'} disponible{product.stock !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
                
                <div className="mb-6">
                  <p className="text-sm text-gray-500 mb-1">Categoría:</p>
                  <p className="text-gray-900 capitalize">{product.category || 'Sin categoría'}</p>
                </div>
                
                {!isOutOfStock && (
                  <div className="mb-6">
                    <p className="text-sm text-gray-500 mb-2">Cantidad:</p>
                    <div className="flex items-center">
                      <button
                        onClick={decrementQuantity}
                        disabled={quantity <= 1}
                        className="px-3 py-1 border border-gray-300 rounded-l-md bg-gray-100 text-gray-600 hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        max={product.stock}
                        value={quantity}
                        onChange={handleQuantityChange}
                        className="w-16 text-center border-t border-b border-gray-300 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        onClick={incrementQuantity}
                        disabled={quantity >= product.stock}
                        className="px-3 py-1 border border-gray-300 rounded-r-md bg-gray-100 text-gray-600 hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="flex flex-col space-y-4 mt-8">
                  <div className="space-y-4">
                    <button
                      onClick={handleAddToCart}
                      disabled={isOutOfStock || isAddingToCart}
                      className={`w-full px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${
                        isOutOfStock 
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                      }`}
                    >
                      {isAddingToCart ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Agregando...
                        </span>
                      ) : isOutOfStock ? (
                        'Agotado'
                      ) : (
                        'Agregar al carrito'
                      )}
                    </button>
                    
                    <button
                      className="w-full px-6 py-3 bg-green-600 text-white font-medium rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      disabled={isOutOfStock}
                      onClick={() => {
                        if (!isAuthenticated()) {
                          navigate("/login", { state: { from: `/producto/${id}` } });
                          return;
                        }
                        addToCart(product, quantity);
                        navigate('/checkout');
                      }}
                    >
                      Comprar ahora
                    </button>
                  </div>
                  
                  <button
                    type="button"
                    className="w-full px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Agregar a favoritos
                  </button>
                </div>
                
                {message && (
                  <div className={`mt-4 p-3 rounded-md ${message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                    {message}
                  </div>
                )}
              </div>
            </div>
            
            {/* Product Description */}
            <div className="mt-12 border-t border-gray-200 pt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Descripción del producto</h2>
              <div className="prose max-w-none">
                <p className="text-gray-600 whitespace-pre-line">
                  {product.description || 'No hay descripción disponible para este producto.'}
                </p>
                
                {product.details && (
                  <div className="mt-6">
                    <h3 className="font-medium text-gray-900 mb-2">Características:</h3>
                    <ul className="list-disc pl-5 text-gray-600 space-y-1">
                      {product.details.split('\n').map((detail, idx) => (
                        <li key={idx}>{detail.trim()}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            
            {/* Related Products */}
            {relatedProducts.length > 0 && (
              <div className="mt-12 border-t border-gray-200 pt-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Productos relacionados</h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {relatedProducts.map((relatedProduct) => (
                    <div key={relatedProduct.id} className="group relative">
                      <Link 
                        to={`/producto/${relatedProduct.id}`}
                        className="block bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow"
                      >
                        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-lg bg-gray-200">
                          <img
                            src={relatedProduct.image || relatedProduct.imageUrl}
                            alt={relatedProduct.name}
                            className="h-48 w-full object-cover object-center group-hover:opacity-75"
                            onError={(e) => {
                              e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTJlOGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzY0NzQ4YiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlByb2R1Y3RvPC90ZXh0Pjwvc3ZnPg==";
                            }}
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 h-12">
                            {relatedProduct.name}
                          </h3>
                          <p className="mt-1 text-sm font-medium text-blue-600">
                            ${relatedProduct.price}
                          </p>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetalleProducto;
