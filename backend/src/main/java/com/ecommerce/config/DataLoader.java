package com.ecommerce.config;

import com.ecommerce.model.Category;
import com.ecommerce.model.Product;
import com.ecommerce.model.User;
import com.ecommerce.repository.CategoryRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Solo cargar datos si las tablas están vacías
        if (categoryRepository.count() == 0) {
            loadCategories();
        }
        
        if (productRepository.count() == 0) {
            loadProducts();
        }
        
        if (userRepository.count() == 0) {
            loadUsers();
        }
    }

    private void loadCategories() {
        Category[] categories = {
            new Category("electronicos", "Electrónicos", "Smartphones, laptops, tablets y accesorios tecnológicos"),
            new Category("ropa", "Ropa", "Vestimenta para hombre y mujer de todas las edades"),
            new Category("hogar", "Hogar", "Muebles, decoración y artículos para el hogar"),
            new Category("deportes", "Deportes", "Equipamiento deportivo y artículos para fitness"),
            new Category("libros", "Libros", "Literatura, educación y entretenimiento"),
            new Category("belleza", "Belleza", "Cosméticos, cuidado personal y fragancias")
        };

        for (Category category : categories) {
            categoryRepository.save(category);
        }
        
        System.out.println("Categorías cargadas exitosamente");
    }

    private void loadProducts() {
        Product[] products = {
            createProduct(1L, "iPhone 14 Pro", "El iPhone más avanzado con chip A16 Bionic, sistema de cámaras Pro y pantalla Super Retina XDR de 6.1 pulgadas.", 999999.0, 15, "electronicos", "https://picsum.photos/300/200?random=1"),
            createProduct(2L, "Samsung Galaxy S23 Ultra", "Smartphone premium con S Pen integrado, cámara de 200MP y pantalla Dynamic AMOLED 2X de 6.8 pulgadas.", 850000.0, 12, "electronicos", "https://picsum.photos/300/200?random=2"),
            createProduct(3L, "Auriculares Bluetooth Sony WH-1000XM5", "Auriculares inalámbricos con cancelación de ruido líder en la industria y hasta 30 horas de batería.", 45000.0, 25, "electronicos", "https://picsum.photos/300/200?random=3"),
            createProduct(4L, "MacBook Air M2", "Laptop ultradelgada con chip M2 de Apple, pantalla Liquid Retina de 13.6 pulgadas y hasta 18 horas de batería.", 1200000.0, 8, "electronicos", "https://picsum.photos/300/200?random=4"),
            createProduct(5L, "Camiseta Básica Algodón", "Camiseta 100% algodón, corte clásico, disponible en varios colores. Perfecta para uso diario.", 2500.0, 50, "ropa", "https://picsum.photos/300/200?random=5"),
            createProduct(6L, "Jeans Slim Fit", "Jeans de mezclilla premium con corte slim fit, cómodos y duraderos. Talla 28-38.", 8500.0, 30, "ropa", "https://picsum.photos/300/200?random=6"),
            createProduct(7L, "Zapatillas Nike Air Max", "Zapatillas deportivas con tecnología Air Max, ideales para running y uso casual.", 12000.0, 20, "deportes", "https://picsum.photos/300/200?random=7"),
            createProduct(8L, "Sofá Modular 3 Plazas", "Sofá modular tapizado en tela gris, cómodo y moderno. Perfecto para sala de estar.", 85000.0, 5, "hogar", "https://picsum.photos/300/200?random=8"),
            createProduct(9L, "Mesa de Centro Madera", "Mesa de centro de madera maciza con acabado natural. Diseño minimalista y funcional.", 25000.0, 10, "hogar", "https://picsum.photos/300/200?random=9"),
            createProduct(10L, "El Principito", "Clásico de la literatura universal por Antoine de Saint-Exupéry. Edición ilustrada.", 1800.0, 40, "libros", "https://picsum.photos/300/200?random=10"),
            createProduct(11L, "Cien Años de Soledad", "Obra maestra de Gabriel García Márquez. Premio Nobel de Literatura.", 2200.0, 35, "libros", "https://picsum.photos/300/200?random=11"),
            createProduct(12L, "Set de Maquillaje Profesional", "Kit completo de maquillaje con paleta de sombras, labiales, base y pinceles profesionales.", 15000.0, 18, "belleza", "https://picsum.photos/300/200?random=12"),
            createProduct(13L, "Crema Facial Hidratante", "Crema facial con ácido hialurónico y vitamina E. Para todo tipo de piel.", 3500.0, 45, "belleza", "https://picsum.photos/300/200?random=13"),
            createProduct(14L, "Bicicleta Montaña 21 Velocidades", "Bicicleta de montaña con marco de aluminio, 21 velocidades Shimano y frenos de disco.", 45000.0, 7, "deportes", "https://picsum.photos/300/200?random=14"),
            createProduct(15L, "Pelota de Fútbol FIFA", "Pelota oficial FIFA, tamaño 5, perfecta para partidos profesionales y amateur.", 4500.0, 25, "deportes", "https://picsum.photos/300/200?random=15"),
            createProduct(16L, "Lámpara de Escritorio LED", "Lámpara LED regulable con brazo articulado y base estable. Ideal para oficina o estudio.", 6500.0, 22, "hogar", "https://picsum.photos/300/200?random=16"),
            createProduct(17L, "Tablet Samsung Galaxy Tab S8", "Tablet Android de 11 pulgadas con S Pen incluido, ideal para trabajo y entretenimiento.", 65000.0, 14, "electronicos", "https://picsum.photos/300/200?random=17"),
            createProduct(18L, "Chaqueta de Cuero", "Chaqueta de cuero genuino, estilo clásico, forrada internamente. Disponible en negro y marrón.", 35000.0, 12, "ropa", "https://picsum.photos/300/200?random=18"),
            createProduct(19L, "Perfume Unisex 100ml", "Fragancia fresca y duradera con notas cítricas y amaderadas. Presentación elegante.", 8500.0, 28, "belleza", "https://picsum.photos/300/200?random=19"),
            createProduct(20L, "Libro de Cocina Mediterránea", "Recetas tradicionales de la cocina mediterránea con ingredientes frescos y saludables.", 2800.0, 32, "libros", "https://picsum.photos/300/200?random=20")
        };

        for (Product product : products) {
            productRepository.save(product);
        }
        
        System.out.println("Productos cargados exitosamente");
    }

    private Product createProduct(Long id, String name, String description, Double price, Integer stock, String category, String imageUrl) {
        Product product = new Product();
        product.setId(id);
        product.setName(name);
        product.setDescription(description);
        product.setPrice(price);
        product.setStock(stock);
        product.setCategory(category);
        product.setImageUrl(imageUrl);
        return product;
    }

    private void loadUsers() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
        
        User[] users = {
            createUser(1L, "admin", "admin@ecommerce.com", "admin123", "Administrador", "Sistema", "admin", "2024-01-01T00:00:00.000Z", true),
            createUser(2L, "usuario1", "usuario1@email.com", "password123", "Juan", "Pérez", "user", "2024-01-15T10:30:00.000Z", true),
            createUser(3L, "maria.garcia", "maria.garcia@email.com", "maria2024", "María", "García", "user", "2024-02-01T14:20:00.000Z", true),
            createUser(4L, "carlos.lopez", "carlos.lopez@email.com", "carlos456", "Carlos", "López", "user", "2024-02-10T09:15:00.000Z", true),
            createUser(5L, "ana.martinez", "ana.martinez@email.com", "ana789", "Ana", "Martínez", "user", "2024-02-20T16:45:00.000Z", true)
        };

        for (User user : users) {
            userRepository.save(user);
        }
        
        System.out.println("Usuarios cargados exitosamente");
    }

    private User createUser(Long id, String username, String email, String password, String firstName, String lastName, String role, String createdAtStr, Boolean isActive) {
        User user = new User();
        user.setId(id);
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password)); // Encriptar contraseña
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setRole(role);
        user.setCreatedAt(LocalDateTime.parse(createdAtStr, DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")));
        user.setIsActive(isActive);
        return user;
    }
}
