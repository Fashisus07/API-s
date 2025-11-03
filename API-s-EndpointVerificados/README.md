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

## 🔐 Autenticación con JWT

### Cómo Obtener un Token

Para acceder a los endpoints protegidos, primero necesitas autenticarte y obtener un token JWT:

#### Opción 1: Registro de Nuevo Usuario
```bash
POST http://localhost:8080/api/auth/register
Content-Type: application/json

{
  "username": "tu_usuario",
  "email": "tu@email.com",
  "password": "tu_contraseña",
  "firstName": "Tu Nombre",
  "lastName": "Tu Apellido"
}
```

#### Opción 2: Login con Usuario Existente
```bash
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "email": "tu@email.com",
  "password": "tu_contraseña"
}
```

#### Respuesta de Autenticación
Ambos endpoints retornan:
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0dUBlbWFpbC5jb20iLCJyb2xlcyI6WyJ1c2VyIl0sImlhdCI6MTcwOTIzNDU2NywiZXhwIjoxNzA5MzIwOTY3fQ.xyz...",
  "username": "tu_usuario",
  "firstName": "Tu Nombre",
  "lastName": "Tu Apellido",
  "email": "tu@email.com",
  "role": "user",
  "profilePhoto": null
}
```

**⏰ Duración del Token:** 24 horas (86400000 ms)

### Cómo Usar el Token

Una vez obtenido el token, debes incluirlo en el header `Authorization` de todas las peticiones a endpoints protegidos:

#### Formato del Header
```
Authorization: Bearer TU_TOKEN_AQUI
```

#### Ejemplos por Herramienta

**cURL:**
```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9..." \
     http://localhost:8080/api/cart
```

**Postman/Insomnia:**
1. Ve a la pestaña "Headers"
2. Agrega un nuevo header:
   - **Key:** `Authorization`
   - **Value:** `Bearer TU_TOKEN_AQUI`

**JavaScript/Axios:**
```javascript
const token = localStorage.getItem('token');

axios.get('http://localhost:8080/api/cart', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

**Fetch API:**
```javascript
fetch('http://localhost:8080/api/cart', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(response => response.json())
.then(data => console.log(data));
```

### Ejemplo Completo de Flujo

```bash
# 1. Hacer login y obtener el token
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@test.com","password":"password123"}'

# Respuesta:
# {"token":"eyJhbGc...","username":"usuario",...}

# 2. Guardar el token (en este ejemplo: eyJhbGc...)

# 3. Usar el token para acceder a endpoints protegidos
curl http://localhost:8080/api/cart \
  -H "Authorization: Bearer eyJhbGc..."

# 4. Agregar producto al carrito
curl -X POST http://localhost:8080/api/cart/add \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{"productId":1,"quantity":2}'
```

### Qué Endpoints Requieren Token

#### 🔒 Requieren Autenticación:
- **Carrito de Compras:** Todos los endpoints `/api/cart/*`
- **Perfil de Usuario:** Todos los endpoints `/api/profile/*`
- **Productos (Modificación):** POST, PUT, DELETE en `/api/products`
- **Categorías (Modificación):** POST, PUT, DELETE en `/api/categories`

#### 🔓 NO Requieren Autenticación:
- **Autenticación:** `/api/auth/register`, `/api/auth/login`
- **Productos (Lectura):** GET `/api/products`, GET `/api/products/{id}`
- **Categorías (Lectura):** GET `/api/categories`, GET `/api/categories/{id}`
- **Archivos Estáticos:** `/`, `/index.html`, `/api-viewer.html`, etc.

### Errores Comunes

**401 Unauthorized**
- Token no incluido en el header
- Token expirado (más de 24 horas)
- Token inválido o malformado
- Formato incorrecto (debe ser `Bearer TOKEN`)

**403 Forbidden**
- Usuario no tiene permisos para ese recurso
- Rol insuficiente (algunos endpoints requieren rol ADMIN)

**Solución:** Hacer login nuevamente para obtener un token válido

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
- ✅ **Categorías dinámicas** cargadas desde el backend
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

## 🗄️ Configuración de pgAdmin

pgAdmin está incluido en el proyecto para gestionar la base de datos PostgreSQL de forma visual.

### Acceso a pgAdmin

**URL:** `http://localhost:5050`

**Credenciales:**
- **Email:** `admin@admin.com`
- **Password:** `admin`

### Conectar al Servidor PostgreSQL

1. **Crear Nueva Conexión:**
   - Click derecho en "Servers" → "Register" → "Server..."

2. **Pestaña "General":**
   - **Name:** `E-Commerce Local` (o el nombre que prefieras)

3. **Pestaña "Connection":**
   ```
   Host name/address: db
   Port: 5432
   Maintenance database: ecommerce
   Username: postgres
   Password: postgres
   ```
   
   ⚠️ **Importante:** Usa `db` como hostname (no `localhost`), es el nombre del servicio en Docker.

4. **Guardar:**
   - Marca "Save password" (opcional)
   - Click en "Save"

### Explorar la Base de Datos

Navega a: `Servers → E-Commerce Local → Databases → ecommerce → Schemas → public → Tables`

**Tablas disponibles:**
- `categories` - Categorías de productos
- `products` - Productos
- `users` - Usuarios del sistema
- `cart_items` - Items del carrito

### Queries Útiles

**Ver productos con categorías:**
```sql
SELECT 
    p.id, p.name, p.price, p.stock,
    c.name as category_name
FROM products p
JOIN categories c ON p.category_id = c.id
ORDER BY p.id;
```

**Estadísticas por categoría:**
```sql
SELECT 
    c.name as categoria,
    COUNT(p.id) as total_productos,
    AVG(p.price) as precio_promedio
FROM categories c
LEFT JOIN products p ON c.id = p.category_id
GROUP BY c.id, c.name
ORDER BY total_productos DESC;
```

## 📦 Sistema de Filtrado Dinámico de Categorías

El frontend carga las categorías automáticamente desde el backend. Cualquier categoría agregada en la base de datos aparecerá automáticamente en el frontend.

### ✨ Características

- ✅ **Carga dinámica** desde PostgreSQL
- ✅ **URLs amigables** (ej: `/productos?category=electrónicos`)
- ✅ **Filtrado en tiempo real**
- ✅ **Sin código hardcodeado**
- ✅ **Escalable** - Agrega categorías sin tocar el código

### Cómo Agregar una Nueva Categoría

#### Opción 1: Desde pgAdmin

1. Accede a pgAdmin en `http://localhost:5050`
2. Navega a la tabla `categories`
3. Click derecho → "View/Edit Data" → "All Rows"
4. Click en "+" para agregar una fila
5. Completa:
   - **name:** Nombre de la categoría (ej: "Juguetes")
   - **description:** Descripción opcional
6. Guarda y recarga el frontend

#### Opción 2: Usando SQL

```sql
INSERT INTO categories (name, description) 
VALUES ('Juguetes', 'Juguetes para todas las edades');
```

#### Opción 3: Desde la API

```bash
POST http://localhost:8080/api/categories
Content-Type: application/json
Authorization: Bearer TU_TOKEN

{
  "name": "Juguetes",
  "description": "Juguetes para todas las edades"
}
```

### Implementación Técnica

**Backend:**
- `Product.java` usa `@ManyToOne(fetch = FetchType.EAGER)` para cargar categorías
- `ProductDTO` incluye `categoryId` y `categoryName`
- `CategoryRepository` con métodos JPA estándar

**Frontend:**
- `Header.jsx` carga todas las categorías con `getCategories()`
- `Productos.jsx` filtra por `categoryName` dinámicamente
- URLs amigables con `encodeURIComponent(category.name.toLowerCase())`

### Íconos Disponibles

El sistema asigna automáticamente íconos según el nombre de la categoría:

- **Electrónicos/Tecnología:** 📱💻
- **Ropa:** 👕
- **Hogar/Muebles:** 🏠🛋️
- **Deportes:** ⚽
- **Libros:** 📚
- **Belleza:** 💄
- **Calzado:** 👟
- **Juguetes:** 🧸
- **Alimentos:** 🍕
- **Por defecto:** 📦

Si agregas una categoría con un nombre no mapeado, se usará el ícono por defecto (📦).

### Colores

Los colores se asignan automáticamente de forma cíclica entre:
- Azul, Rosa, Verde, Naranja, Púrpura, Rojo, Amarillo, Índigo, Teal, Cyan

### Ejemplo Completo

```sql
-- Agregar categoría "Calzado"
INSERT INTO categories (name, description) 
VALUES ('Calzado', 'Todo tipo de calzado deportivo y casual');

-- Agregar productos a la nueva categoría
INSERT INTO products (name, description, price, stock, image_url, category_id)
VALUES 
  ('Nike Air Max', 'Zapatillas deportivas', 89.99, 25, 'url', 
   (SELECT id FROM categories WHERE name = 'Calzado')),
  ('Adidas Superstar', 'Zapatillas clásicas', 79.99, 30, 'url',
   (SELECT id FROM categories WHERE name = 'Calzado'));
```

Después de agregar la categoría y productos, simplemente recarga el frontend y verás:
- La nueva categoría "Calzado" con ícono 👟 en la página de inicio
- Los productos asociados cuando hagas click en la categoría

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

## 🏗️ Refactorización con Lombok

El proyecto backend utiliza **Lombok** para reducir código boilerplate y mejorar la legibilidad.

### Anotaciones Utilizadas

- `@Getter` / `@Setter` - Genera getters y setters automáticamente
- `@NoArgsConstructor` - Constructor sin argumentos
- `@AllArgsConstructor` - Constructor con todos los argumentos
- `@Builder` - Patrón Builder para crear objetos

### Ejemplo de Entidad

```java
@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;
    
    // ... más campos
}
```

### Beneficios

- ✅ **Menos código** - No más getters/setters manuales
- ✅ **Más legible** - Enfoque en la lógica de negocio
- ✅ **Menos errores** - Generación automática consistente
- ✅ **Builder pattern** - Creación de objetos más clara

## 🐳 Publicación en Docker Hub

### Preparación

1. **Crear cuenta en Docker Hub:** https://hub.docker.com

2. **Login desde terminal:**
```bash
docker login
```

### Publicar Backend

```bash
# Construir imagen
cd backend
docker build -t facu07/ecommerce-backend:latest .

# Publicar
docker push facu07/ecommerce-backend:latest
```

### Publicar Frontend

```bash
# Construir imagen
cd frontend
docker build -t facu07/ecommerce-frontend:latest .

# Publicar
docker push facu07/ecommerce-frontend:latest
```

### ✅ Imágenes Publicadas en Docker Hub

Las imágenes están disponibles públicamente:

| Componente | Repositorio | Imagen | Tamaño |
|------------|-------------|--------|--------|
| **Backend** | [facu07/ecommerce-backend](https://hub.docker.com/r/facu07/ecommerce-backend) | `facu07/ecommerce-backend:latest` | ~612 MB |
| **Frontend** | [facu07/ecommerce-frontend](https://hub.docker.com/r/facu07/ecommerce-frontend) | `facu07/ecommerce-frontend:latest` | ~87.5 MB |

### Desplegar desde Docker Hub

#### Opción 1: Con docker-compose.prod.yml (Recomendado)

```bash
# Descargar solo el archivo docker-compose.prod.yml
# Luego ejecutar:
docker-compose -f docker-compose.prod.yml up -d
```

**Acceder a:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- PgAdmin: http://localhost:5050

#### Opción 2: Pull Manual

```bash
docker pull facu07/ecommerce-backend:latest
docker pull facu07/ecommerce-frontend:latest
docker-compose -f docker-compose.prod.yml up -d
```

#### Opción 3: Contenedores Individuales

**Backend:**
```bash
docker run -d --name ecommerce-backend -p 8080:8080 \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/ecommerce \
  -e SPRING_DATASOURCE_USERNAME=postgres \
  -e SPRING_DATASOURCE_PASSWORD=postgres \
  -e JWT_SECRET=MySuperSecretKeyForJWTs \
  -e JWT_EXPIRATION=86400000 \
  facu07/ecommerce-backend:latest
```

**Frontend:**
```bash
docker run -d --name ecommerce-frontend -p 3000:80 \
  facu07/ecommerce-frontend:latest
```

### Actualizar Imágenes

Si haces cambios y quieres actualizar en Docker Hub:

```bash
# Reconstruir y publicar backend
cd backend
docker build -t facu07/ecommerce-backend:latest .
docker push facu07/ecommerce-backend:latest

# Reconstruir y publicar frontend
cd frontend
docker build -t facu07/ecommerce-frontend:latest .
docker push facu07/ecommerce-frontend:latest
```

### Versionado de Imágenes (Recomendado)

```bash
# Backend con versión
docker build -t facu07/ecommerce-backend:v1.0.0 .
docker tag facu07/ecommerce-backend:v1.0.0 facu07/ecommerce-backend:latest
docker push facu07/ecommerce-backend:v1.0.0
docker push facu07/ecommerce-backend:latest

# Frontend con versión
docker build -t facu07/ecommerce-frontend:v1.0.0 .
docker tag facu07/ecommerce-frontend:v1.0.0 facu07/ecommerce-frontend:latest
docker push facu07/ecommerce-frontend:v1.0.0
docker push facu07/ecommerce-frontend:latest
```

**Ventaja:** Despliega en cualquier máquina sin necesidad del código fuente

## 🎯 Próximas Mejoras

- [ ] Sistema de pagos (Stripe/MercadoPago)
- [ ] Historial de pedidos
- [ ] Sistema de reviews y calificaciones
- [ ] Búsqueda avanzada de productos
- [ ] Filtros múltiples (categoría + precio + stock)
- [ ] Panel de administración completo
- [ ] Notificaciones en tiempo real
- [ ] Sistema de favoritos/wishlist
- [ ] Paginación de productos
- [ ] Ordenamiento (precio, nombre, popularidad)

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
