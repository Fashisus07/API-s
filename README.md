# 🛒 E-Commerce API

Proyecto E-Commerce backend con Spring Boot, PostgreSQL y JWT authentication. Implementa arquitectura en capas con DTOs, servicios y manejo global de excepciones.

## 🏗️ Arquitectura

- **Spring Boot 3.2.5** - Framework principal
- **PostgreSQL 13** - Base de datos
- **JWT** - Autenticación y autorización
- **Docker** - Containerización de la base de datos
- **Maven** - Gestión de dependencias

## 📁 Estructura del Proyecto

```
backend/
├── src/main/java/com/ecommerce/
│   ├── controller/     # Controladores REST
│   ├── service/        # Lógica de negocio
│   ├── repository/     # Acceso a datos
│   ├── entity/         # Entidades JPA
│   ├── dto/           # Data Transfer Objects
│   ├── exception/     # Manejo de excepciones
│   └── config/        # Configuraciones
├── docker-compose-db.yml  # PostgreSQL con Docker
└── pom.xml            # Dependencias Maven
```

## 🚀 Instalación y Ejecución

### Prerrequisitos
- Java 17+
- Maven 3.6+
- Docker y Docker Compose

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd API-s-nueva-version
```

### 2. Levantar la base de datos
```bash
docker-compose -f docker-compose-db.yml up -d
```

### 3. Ejecutar la aplicación
```bash
cd backend
mvn spring-boot:run
```

La API estará disponible en: `http://localhost:8080`

## 📋 Endpoints Principales

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión

### Productos
- `GET /api/products` - Listar productos
- `GET /api/products/{id}` - Obtener producto
- `POST /api/products` - Crear producto (requiere auth)
- `PUT /api/products/{id}` - Actualizar producto (requiere auth)
- `DELETE /api/products/{id}` - Eliminar producto (requiere auth)

### Categorías
- `GET /api/categories` - Listar categorías
- `POST /api/categories` - Crear categoría (requiere auth)

### Carrito
- `GET /api/cart` - Ver carrito (requiere auth)
- `POST /api/cart/add` - Agregar al carrito (requiere auth)
- `PUT /api/cart/update` - Actualizar cantidad (requiere auth)
- `DELETE /api/cart/remove/{productId}` - Remover del carrito (requiere auth)

### Perfil de Usuario
- `GET /api/profile/me` - Ver perfil (requiere auth)
- `PUT /api/profile/update` - Actualizar perfil (requiere auth)
- `PUT /api/profile/change-password` - Cambiar contraseña (requiere auth)

## 🛠️ Tecnologías Implementadas

- **DTOs**: Transferencia segura de datos
- **Bean Validation**: Validación automática de datos
- **JWT Authentication**: Seguridad con tokens
- **Global Exception Handler**: Manejo centralizado de errores
- **Service Layer**: Separación de lógica de negocio
- **PostgreSQL**: Base de datos relacional
- **Docker**: Containerización

## 🔧 Configuración

### Base de Datos
La aplicación se conecta a PostgreSQL en el puerto 5433. La configuración está en:
- `docker-compose-db.yml` - Configuración de Docker
- `application.properties` - Configuración de Spring Boot

### JWT
- Secret: Configurado en `application.properties`
- Expiración: 24 horas por defecto

## 🧪 Datos de Prueba

La aplicación incluye un `DataLoader` que carga datos iniciales:
- Categorías de ejemplo
- Productos de muestra
- Usuario administrador por defecto

## 👥 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.
