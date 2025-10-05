# Migración de Datos a Base de Datos

## Cambios Realizados

Se ha migrado la aplicación de usar archivos JSON simulados a una base de datos PostgreSQL real. Los cambios incluyen:

### 1. Modelos Actualizados
- **User**: Actualizado para incluir `username`, `firstName`, `lastName`, `role`, `createdAt`, `isActive`
- **Category**: Nuevo modelo para categorías de productos
- **Product**: Mantiene la misma estructura

### 2. Repositorios
- **UserRepository**: Agregados métodos para `findByUsername` y `existsByUsername`
- **CategoryRepository**: Nuevo repositorio para categorías
- **ProductRepository**: Sin cambios

### 3. Controladores Actualizados
- **AuthController**: Actualizado para trabajar con el nuevo modelo User
- **UserProfileController**: Actualizado para los nuevos campos
- **CategoryController**: Nuevo controlador para gestionar categorías

### 4. Carga Automática de Datos
- **DataLoader**: Componente que carga automáticamente los datos de los JSON originales a la base de datos al iniciar la aplicación

## Instrucciones de Ejecución

### Opción 1: Con Docker (Recomendado)
```bash
# Desde la raíz del proyecto
docker-compose up --build
```

### Opción 2: Local
1. Instalar PostgreSQL y crear base de datos `ecommerce`
2. Configurar usuario `postgres` con contraseña `postgres`
3. Ejecutar el backend:
```bash
cd backend
mvn spring-boot:run
```

## Datos Iniciales

La aplicación cargará automáticamente:
- **5 usuarios** (incluyendo admin)
- **20 productos** en 6 categorías diferentes
- **6 categorías** de productos

### Usuario Administrador
- **Username**: admin
- **Email**: admin@ecommerce.com  
- **Password**: admin123
- **Role**: admin

### Usuarios de Prueba
- **Username**: usuario1, **Email**: usuario1@email.com, **Password**: password123
- **Username**: maria.garcia, **Email**: maria.garcia@email.com, **Password**: maria2024
- Y más...

## Nuevos Endpoints

### Categorías
- `GET /api/categories` - Obtener todas las categorías
- `GET /api/categories/{id}` - Obtener categoría por ID
- `POST /api/categories` - Crear nueva categoría
- `PUT /api/categories/{id}` - Actualizar categoría
- `DELETE /api/categories/{id}` - Eliminar categoría

## Configuración de Base de Datos

La aplicación está configurada para:
- **Host**: localhost
- **Puerto**: 5433 (mapeado desde el contenedor Docker)
- **Base de datos**: ecommerce
- **Usuario**: postgres
- **Contraseña**: postgres

## Notas Importantes

1. Los datos se cargan automáticamente solo si las tablas están vacías
2. Las contraseñas se encriptan automáticamente con BCrypt
3. La aplicación usa JPA/Hibernate para la gestión de la base de datos
4. Los archivos JSON originales ya no se usan, pero se mantienen como referencia
