package com.ecommerce.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;

@Configuration
public class DatabaseConfig {

    @Bean
    @Primary
    public DataSource dataSource() {
        HikariConfig config = new HikariConfig();
        config.setDriverClassName("org.postgresql.Driver");
        // Configurar para usar zona horaria de Argentina
        config.setJdbcUrl("jdbc:postgresql://localhost:5433/ecommerce");
        config.setUsername("postgres");
        config.setPassword("postgres");
        
        // Configuraciones de conexión
        config.setConnectionTimeout(20000);
        config.setMaximumPoolSize(5);
        config.setPoolName("ecommerce-pool");
        
        // Propiedades para zona horaria de Argentina
        config.addDataSourceProperty("ApplicationName", "ecommerce-app");
        config.addDataSourceProperty("assumeMinServerVersion", "9.0");
        
        return new HikariDataSource(config);
    }
}
