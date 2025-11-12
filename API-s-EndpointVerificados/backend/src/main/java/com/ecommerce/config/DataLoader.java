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

    private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");

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
            Category.builder().name("Electrónicos").description("Smartphones, laptops, tablets y accesorios tecnológicos").build(),
            Category.builder().name("Ropa").description("Vestimenta para hombre y mujer de todas las edades").build(),
            Category.builder().name("Hogar").description("Muebles, decoración y artículos para el hogar").build(),
            Category.builder().name("Deportes").description("Equipamiento deportivo y artículos para fitness").build(),
            Category.builder().name("Libros").description("Literatura, educación y entretenimiento").build(),
            Category.builder().name("Belleza").description("Cosméticos, cuidado personal y fragancias").build()
        };

        for (Category category : categories) {
            categoryRepository.save(category);
        }
        
        System.out.println("Categorías cargadas exitosamente");
    }

    private void loadProducts() {
        // Obtener categorías guardadas
        Category electronicos = categoryRepository.findAll().stream()
                .filter(c -> c.getName().equals("Electrónicos")).findFirst().orElse(null);
        Category ropa = categoryRepository.findAll().stream()
                .filter(c -> c.getName().equals("Ropa")).findFirst().orElse(null);
        Category hogar = categoryRepository.findAll().stream()
                .filter(c -> c.getName().equals("Hogar")).findFirst().orElse(null);
        Category deportes = categoryRepository.findAll().stream()
                .filter(c -> c.getName().equals("Deportes")).findFirst().orElse(null);
        Category libros = categoryRepository.findAll().stream()
                .filter(c -> c.getName().equals("Libros")).findFirst().orElse(null);
        Category belleza = categoryRepository.findAll().stream()
                .filter(c -> c.getName().equals("Belleza")).findFirst().orElse(null);

        Product[] products = {
            Product.builder().name("iPhone 14 Pro").description("El iPhone más avanzado con chip A16 Bionic, sistema de cámaras Pro y pantalla Super Retina XDR de 6.1 pulgadas.").price(999999.0).stock(15).category(electronicos).imageUrl("https://picsum.photos/300/200?random=1").build(),
            Product.builder().name("Samsung Galaxy S23 Ultra").description("Smartphone premium con S Pen integrado, cámara de 200MP y pantalla Dynamic AMOLED 2X de 6.8 pulgadas.").price(850000.0).stock(12).category(electronicos).imageUrl("https://picsum.photos/300/200?random=2").build(),
            Product.builder().name("Auriculares Bluetooth Sony WH-1000XM5").description("Auriculares inalámbricos con cancelación de ruido líder en la industria y hasta 30 horas de batería.").price(45000.0).stock(25).category(electronicos).imageUrl("https://picsum.photos/300/200?random=3").build(),
            Product.builder().name("MacBook Air M2").description("Laptop ultradelgada con chip M2 de Apple, pantalla Liquid Retina de 13.6 pulgadas y hasta 18 horas de batería.").price(1200000.0).stock(8).category(electronicos).imageUrl("https://picsum.photos/300/200?random=4").build(),
            Product.builder().name("Camiseta Básica Algodón").description("Camiseta 100% algodón, corte clásico, disponible en varios colores. Perfecta para uso diario.").price(2500.0).stock(50).category(ropa).imageUrl("https://picsum.photos/300/200?random=5").build(),
            Product.builder().name("Jeans Slim Fit").description("Jeans de mezclilla premium con corte slim fit, cómodos y duraderos. Talla 28-38.").price(8500.0).stock(30).category(ropa).imageUrl("https://picsum.photos/300/200?random=6").build(),
            Product.builder().name("Zapatillas Nike Air Max").description("Zapatillas deportivas con tecnología Air Max, ideales para running y uso casual.").price(12000.0).stock(20).category(deportes).imageUrl("https://picsum.photos/300/200?random=7").build(),
            Product.builder().name("Sofá Modular 3 Plazas").description("Sofá modular tapizado en tela gris, cómodo y moderno. Perfecto para sala de estar.").price(85000.0).stock(5).category(hogar).imageUrl("https://picsum.photos/300/200?random=8").build(),
            Product.builder().name("Mesa de Centro Madera").description("Mesa de centro de madera maciza con acabado natural. Diseño minimalista y funcional.").price(25000.0).stock(10).category(hogar).imageUrl("https://picsum.photos/300/200?random=9").build(),
            Product.builder().name("El Principito").description("Clásico de la literatura universal por Antoine de Saint-Exupéry. Edición ilustrada.").price(1800.0).stock(40).category(libros).imageUrl("https://picsum.photos/300/200?random=10").build(),
            Product.builder().name("Cien Años de Soledad").description("Obra maestra de Gabriel García Márquez. Premio Nobel de Literatura.").price(2200.0).stock(35).category(libros).imageUrl("https://picsum.photos/300/200?random=11").build(),
            Product.builder().name("Set de Maquillaje Profesional").description("Kit completo de maquillaje con paleta de sombras, labiales, base y pinceles profesionales.").price(15000.0).stock(18).category(belleza).imageUrl("https://picsum.photos/300/200?random=12").build(),
            Product.builder().name("Crema Facial Hidratante").description("Crema facial con ácido hialurónico y vitamina E. Para todo tipo de piel.").price(3500.0).stock(45).category(belleza).imageUrl("https://picsum.photos/300/200?random=13").build(),
            Product.builder().name("Bicicleta Montaña 21 Velocidades").description("Bicicleta de montaña con marco de aluminio, 21 velocidades Shimano y frenos de disco.").price(45000.0).stock(7).category(deportes).imageUrl("https://picsum.photos/300/200?random=14").build(),
            Product.builder().name("Pelota de Fútbol FIFA").description("Pelota oficial FIFA, tamaño 5, perfecta para partidos profesionales y amateur.").price(4500.0).stock(25).category(deportes).imageUrl("https://picsum.photos/300/200?random=15").build(),
            Product.builder().name("Lámpara de Escritorio LED").description("Lámpara LED regulable con brazo articulado y base estable. Ideal para oficina o estudio.").price(6500.0).stock(22).category(hogar).imageUrl("https://picsum.photos/300/200?random=16").build(),
            Product.builder().name("Tablet Samsung Galaxy Tab S8").description("Tablet Android de 11 pulgadas con S Pen incluido, ideal para trabajo y entretenimiento.").price(65000.0).stock(14).category(electronicos).imageUrl("https://picsum.photos/300/200?random=17").build(),
            Product.builder().name("Chaqueta de Cuero").description("Chaqueta de cuero genuino, estilo clásico, forrada internamente. Disponible en negro y marrón.").price(35000.0).stock(12).category(ropa).imageUrl("https://picsum.photos/300/200?random=18").build(),
            Product.builder().name("Perfume Unisex 100ml").description("Fragancia fresca y duradera con notas cítricas y amaderadas. Presentación elegante.").price(8500.0).stock(28).category(belleza).imageUrl("https://picsum.photos/300/200?random=19").build(),
            Product.builder().name("Libro de Cocina Mediterránea").description("Recetas tradicionales de la cocina mediterránea con ingredientes frescos y saludables.").price(2800.0).stock(32).category(libros).imageUrl("https://picsum.photos/300/200?random=20").build()
        };

        for (Product product : products) {
            productRepository.save(product);
        }
        
        System.out.println("Productos cargados exitosamente");
    }


    private void loadUsers() {
        User[] users = {
            User.builder().username("admin").email("admin@ecommerce.com").password(passwordEncoder.encode("admin123")).firstName("Administrador").lastName("Sistema").role("ADMIN").createdAt(LocalDateTime.parse("2024-01-01T00:00:00.000Z", DATE_TIME_FORMATTER)).isActive(true).build(),
            User.builder().username("usuario1").email("usuario1@email.com").password(passwordEncoder.encode("password123")).firstName("Juan").lastName("Pérez").role("USER").createdAt(LocalDateTime.parse("2024-01-15T10:30:00.000Z", DATE_TIME_FORMATTER)).isActive(true).build(),
            User.builder().username("maria.garcia").email("maria.garcia@email.com").password(passwordEncoder.encode("maria2024")).firstName("María").lastName("García").role("USER").createdAt(LocalDateTime.parse("2024-02-01T14:20:00.000Z", DATE_TIME_FORMATTER)).isActive(true).build(),
            User.builder().username("carlos.lopez").email("carlos.lopez@email.com").password(passwordEncoder.encode("carlos456")).firstName("Carlos").lastName("López").role("USER").createdAt(LocalDateTime.parse("2024-02-10T09:15:00.000Z", DATE_TIME_FORMATTER)).isActive(true).build(),
            User.builder().username("ana.martinez").email("ana.martinez@email.com").password(passwordEncoder.encode("ana789")).firstName("Ana").lastName("Martínez").role("USER").createdAt(LocalDateTime.parse("2024-02-20T16:45:00.000Z", DATE_TIME_FORMATTER)).isActive(true).build()
        };

        for (User user : users) {
            userRepository.save(user);
        }
        
        System.out.println("Usuarios cargados exitosamente");
    }

}
