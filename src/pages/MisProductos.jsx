import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function MisProductos() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("active");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const navigate = useNavigate();

  // Cargar productos del usuario
  useEffect(() => {
    const loadUserProducts = async () => {
      try {
        // Simular carga
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Obtener productos del localStorage
        const savedProducts = JSON.parse(localStorage.getItem('userProducts') || '[]');
        setProducts(savedProducts);
        setLoading(false);
      } catch (err) {
        console.error("Error al cargar productos:", err);
        setError("No se pudieron cargar tus productos. Por favor, inténtalo de nuevo.");
        setLoading(false);
      }
    };
    
    loadUserProducts();
  }, []);

  // Filtrar productos por estado
  const filteredProducts = products.filter(product => {
    if (activeTab === "all") return true;
    return product.status === activeTab;
  });

  // Manejar cambio de estado de un producto
  const handleStatusChange = async (productId, newStatus) => {
    try {
      const updatedProducts = products.map(product => 
        product.id === productId ? { ...product, status: newStatus } : product
      );
      
      // Actualizar en localStorage
      localStorage.setItem('userProducts', JSON.stringify(updatedProducts));
      setProducts(updatedProducts);
      
      // Mostrar mensaje de éxito
      setError("");
    } catch (err) {
      console.error("Error al actualizar el estado del producto:", err);
      setError("No se pudo actualizar el estado del producto. Inténtalo de nuevo.");
    }
  };

  // Confirmar eliminación de producto
  const confirmDelete = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  // Eliminar producto
  const handleDelete = () => {
    if (!productToDelete) return;
    
    try {
      const updatedProducts = products.filter(p => p.id !== productToDelete.id);
      
      // Actualizar en localStorage
      localStorage.setItem('userProducts', JSON.stringify(updatedProducts));
      setProducts(updatedProducts);
      
      // Cerrar modal y limpiar
      setShowDeleteModal(false);
      setProductToDelete(null);
      setError("");
    } catch (err) {
      console.error("Error al eliminar el producto:", err);
      setError("No se pudo eliminar el producto. Inténtalo de nuevo.");
    }
  };

  // Obtener la clase de estado para el badge
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      case 'sold_out':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  // Obtener el texto del estado
  const getStatusText = (status) => {
    const statusMap = {
      'active': 'Activo',
      'draft': 'Borrador',
      'archived': 'Archivado',
      'sold_out': 'Agotado'
    };
    return statusMap[status] || status;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando tus productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold text-gray-900">Mis Productos</h1>
            <p className="mt-2 text-sm text-gray-500">
              Gestiona los productos que has publicado en la plataforma.
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4
          ">
            <Link
              to="/publicar-producto"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Nuevo Producto
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Filtros */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("active")}
              className={`${activeTab === "active" ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Activos
            </button>
            <button
              onClick={() => setActiveTab("draft")}
              className={`${activeTab === "draft" ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Borradores
            </button>
            <button
              onClick={() => setActiveTab("sold_out")}
              className={`${activeTab === "sold_out" ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Agotados
            </button>
            <button
              onClick={() => setActiveTab("archived")}
              className={`${activeTab === "archived" ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Archivados
            </button>
            <button
              onClick={() => setActiveTab("all")}
              className={`${activeTab === "all" ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Todos
            </button>
          </nav>
        </div>

        {/* Lista de productos */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {filteredProducts.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <li key={product.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-20 w-20 rounded-md overflow-hidden">
                          <img 
                            src={product.images?.[0] || "https://via.placeholder.com/150"} 
                            alt={product.name}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTJlOGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzY0NzQ4YiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlByb2R1Y3RvPC90ZXh0Pjwvc3ZnPg==";
                            }}
                          />
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                          <div className="flex items-center mt-1">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(product.status)}`}>
                              {getStatusText(product.status)}
                            </span>
                            <span className="ml-2 text-sm text-gray-500">
                              {product.category ? `• ${product.category}` : ''}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">
                            Publicado el {new Date(product.createdAt || new Date()).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0 flex">
                        <p className="text-lg font-medium text-gray-900">
                          ${product.price?.toFixed(2) || '0.00'}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <div className="flex space-x-3">
                        <Link
                          to={`/editar-producto/${product.id}`}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <svg className="-ml-1 mr-1.5 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                          Editar
                        </Link>
                        
                        <button
                          onClick={() => confirmDelete(product)}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <svg className="-ml-1 mr-1.5 h-4 w-4 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          Eliminar
                        </button>
                      </div>
                      
                      <div className="flex-shrink-0">
                        <div className="relative inline-block text-left">
                          <div>
                            <select
                              value={product.status}
                              onChange={(e) => handleStatusChange(product.id, e.target.value)}
                              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                            >
                              <option value="active">Activo</option>
                              <option value="draft">Borrador</option>
                              <option value="sold_out">Agotado</option>
                              <option value="archived">Archivado</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay productos</h3>
              <p className="mt-1 text-sm text-gray-500">
                {activeTab === 'all' 
                  ? 'Aún no has publicado ningún producto.' 
                  : `No tienes productos ${getStatusText(activeTab).toLowerCase()}.`}
              </p>
              <div className="mt-6
              ">
                <Link
                  to="/publicar-producto"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Nuevo Producto
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setShowDeleteModal(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    Eliminar producto
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      ¿Estás seguro de que quieres eliminar el producto <span className="font-medium">{productToDelete?.name}</span>? Esta acción no se puede deshacer.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleDelete}
                >
                  Eliminar
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MisProductos;
