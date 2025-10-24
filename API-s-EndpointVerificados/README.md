# 🛒 UADE E-Commerce - Full Stack Application

Aplicación E-Commerce completa con backend Spring Boot, frontend React y PostgreSQL. Implementa arquitectura en capas, autenticación JWT, y una interfaz moderna con TailwindCSS.

## 🏗️ Stack Tecnológico

### Backend
- **Spring Boot 3.2.5** - Framework principal
- **PostgreSQL 13** - Base de datos relacional
- **JWT** - Autenticación y autorización
- **Maven** - Gestión de dependencias
- **Docker** - Containerización

### Frontend
- **React 18** - Librería UI
- **React Router** - Navegación
- **TailwindCSS** - Estilos y diseño
- **Axios** - Cliente HTTP
- **Nginx** - Servidor web en producción

## 📁 Estructura del Proyecto

```
API-s-EndpointVerificados/
├── backend/
│   ├── src/main/java/com/ecommerce/
│   │   ├── controller/     # Controladores REST
│   │   ├── service/        # Lógica de negocio
│   │   ├── repository/     # Acceso a datos (JPA)
│   │   ├── entity/         # Entidades JPA
│   │   ├── dto/           # Data Transfer Objects
│   │   ├── exception/     # Manejo de excepciones
│   │   ├── security/      # Configuración JWT y seguridad
│   │   └── config/        # Configuraciones generales
│   ├── src/main/resources/
│   │   ├── static/        # Archivos estáticos (index.html, api-viewer.html)
│   │   └── data.sql       # Datos iniciales
│   ├── Dockerfile
│   └── pom.xml
├── frontend/
│   ├── public/
│   │   ├── UADE-Logo.png
│   │   └── UADE-commerce.png
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   ├── pages/         # Páginas de la aplicación
│   │   ├── App.jsx        # Componente principal
│   │   └── api.jsx        # Configuración de Axios
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml     # Orquestación de servicios
├── .gitignore
└── README.md
```

## 🚀 Instalación y Ejecución

### Prerrequisitos
- Docker Desktop instalado
- Docker Compose
- Puertos disponibles: 3000 (Frontend), 8080 (Backend), 5433 (PostgreSQL)

### Opción 1: Ejecutar con Docker (Recomendado)

1. **Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd API-s-EndpointVerificados
```

2. **Levantar todos los servicios**
```bash
docker-compose up -d --build
```

3. **Acceder a la aplicación**
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8080`
- API Viewer: `http://localhost:8080/api-viewer.html`
- Base de datos: `localhost:5433`

4. **Detener los servicios**
```bash
docker-compose down
```

### Opción 2: Desarrollo Local

#### Backend
```bash
cd backend
mvn spring-boot:run
```

#### Frontend
```bash
cd frontend
npm install
npm start
```

## 📋 API Endpoints

### 🔓 Endpoints Públicos (Sin autenticación)

#### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión (retorna JWT token)

#### Productos
- `GET /api/products` - Listar todos los productos
- `GET /api/products/{id}` - Obtener producto por ID

#### Categorías
- `GET /api/categories` - Listar todas las categorías
- `GET /api/categories/{id}` - Obtener categoría por ID

### 🔒 Endpoints Protegidos (Requieren autenticación)

#### Productos (Admin)
- `POST /api/products` - Crear nuevo producto
- `PUT /api/products/{id}` - Actualizar producto
- `DELETE /api/products/{id}` - Eliminar producto

#### Categorías (Admin)
- `POST /api/categories` - Crear nueva categoría
- `PUT /api/categories/{id}` - Actualizar categoría
- `DELETE /api/categories/{id}` - Eliminar categoría

#### Carrito de Compras
- `GET /api/cart` - Ver carrito del usuario
- `POST /api/cart/add` - Agregar producto al carrito
- `PUT /api/cart/update` - Actualizar cantidad de producto
- `DELETE /api/cart/remove/{productId}` - Remover producto del carrito
- `POST /api/cart/checkout` - Finalizar compra

#### Perfil de Usuario
- `GET /api/profile/me` - Ver perfil del usuario
- `PUT /api/profile/update` - Actualizar información del perfil
- `PUT /api/profile/change-password` - Cambiar contraseña
- `POST /api/profile/upload-photo` - Subir foto de perfil

### 📡 API Viewer
Accede a `http://localhost:8080/api-viewer.html` para una interfaz interactiva donde puedes:
- Ver todos los endpoints disponibles
- Ejecutar peticiones GET directamente desde el navegador
- Ver respuestas JSON formateadas con syntax highlighting
- Copiar respuestas al portapapeles

## ✨ Características Principales

### Backend
- ✅ **Arquitectura en capas** (Controller → Service → Repository)
- ✅ **DTOs** para transferencia segura de datos
- ✅ **Bean Validation** para validación automática
- ✅ **JWT Authentication** con Spring Security
- ✅ **Global Exception Handler** para manejo centralizado de errores
- ✅ **CORS configurado** para comunicación con frontend
- ✅ **Data loader** con datos iniciales de prueba
- ✅ **API Viewer** interactivo incluido

### Frontend
- ✅ **Diseño responsive** con TailwindCSS
- ✅ **Navegación** con React Router
- ✅ **Autenticación** con JWT y localStorage
- ✅ **Carrito de compras** funcional
- ✅ **Gestión de productos** y categorías
- ✅ **Perfil de usuario** editable
- ✅ **Footer profesional** con redes sociales
- ✅ **Componentes reutilizables** (Navbar, Footer, ProductCard)

## 🔧 Configuración

### Variables de Entorno (Backend)
Configuradas en `docker-compose.yml`:
```yaml
SPRING_DATASOURCE_URL: jdbc:postgresql://db:5432/ecommerce
SPRING_DATASOURCE_USERNAME: postgres
SPRING_DATASOURCE_PASSWORD: postgres
JWT_SECRET: MySuperSecretKeyForJWTs
JWT_EXPIRATION: 86400000  # 24 horas
```

### Base de Datos
- **Host**: localhost
- **Puerto**: 5433
- **Base de datos**: ecommerce
- **Usuario**: postgres
- **Contraseña**: postgres

## 🧪 Datos de Prueba

La aplicación incluye un `DataLoader` (`backend/src/main/resources/data.sql`) que carga datos iniciales automáticamente:

### Categorías
- Electrónicos
- Ropa
- Deportes
- Libros
- Hogar

### Productos de Ejemplo
- iPhone 14 Pro
- Samsung Galaxy S23
- MacBook Pro M2
- Y más...

### Usuario de Prueba
Puedes crear tu propio usuario mediante el registro, o usar el sistema de autenticación para crear usuarios administradores.

## 🐳 Comandos Docker Útiles

```bash
# Ver logs de todos los servicios
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db

# Reconstruir y levantar servicios
docker-compose up -d --build

# Detener servicios
docker-compose stop

# Detener y eliminar contenedores
docker-compose down

# Eliminar todo incluyendo volúmenes (⚠️ borra la base de datos)
docker-compose down -v

# Ver estado de los servicios
docker-compose ps
```

## 🔍 Solución de Problemas

### El frontend no se conecta al backend
- Verifica que el backend esté corriendo en `http://localhost:8080`
- Revisa la configuración de CORS en `SecurityConfig.java`
- Verifica la URL de la API en `frontend/src/api.jsx`

### Error de conexión a la base de datos
- Asegúrate de que el contenedor de PostgreSQL esté corriendo: `docker-compose ps`
- Verifica que el puerto 5433 no esté en uso
- Revisa los logs: `docker-compose logs db`

### El backend no inicia
- Verifica que Java 17+ esté instalado
- Revisa los logs: `docker-compose logs backend`
- Asegúrate de que el puerto 8080 esté disponible

## 📚 Estructura de Datos

### Entidades Principales

**User**
- id, username, email, password (encriptado)
- role (USER, ADMIN)
- createdAt, updatedAt

**Product**
- id, name, description, price
- stock, imageUrl
- category (relación ManyToOne)

**Category**
- id, name, description
- products (relación OneToMany)

**CartItem**
- id, quantity
- user, product (relaciones ManyToOne)

## 🎯 Próximas Mejoras

- [ ] Sistema de pagos (Stripe/MercadoPago)
- [ ] Historial de pedidos
- [ ] Sistema de reviews y calificaciones
- [ ] Búsqueda avanzada de productos
- [ ] Filtros por categoría y precio
- [ ] Panel de administración completo
- [ ] Notificaciones en tiempo real
- [ ] Sistema de favoritos/wishlist

## 👥 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto fue desarrollado como parte del curso de Aplicaciones Interactivas en UADE.

## 👨‍💻 Autor

Proyecto desarrollado por estudiantes de UADE - 2025

---

⭐ Si te gustó este proyecto, no olvides darle una estrella!
