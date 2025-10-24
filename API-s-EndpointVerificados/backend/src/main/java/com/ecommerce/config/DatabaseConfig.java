package com.ecommerce.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;

@Configuration
public class DatabaseConfig {

    @Value("${spring.datasource.url:jdbc:postgresql://localhost:5433/ecommerce}")
    private String jdbcUrl;
    
    @Value("${spring.datasource.username:postgres}")
    private String username;
    
    @Value("${spring.datasource.password:postgres}")
    private String password;

    @Bean
    @Primary
    public DataSource dataSource() {
        HikariConfig config = new HikariConfig();
        config.setDriverClassName("org.postgresql.Driver");
        config.setJdbcUrl(jdbcUrl);
        config.setUsername(username);
        config.setPassword(password);
        
        // Configuraciones de conexión
        config.setConnectionTimeout(20000);
        config.setMaximumPoolSize(5);
        config.setPoolName("ecommerce-pool");
        
        // Propiedades adicionales
        config.addDataSourceProperty("ApplicationName", "ecommerce-app");
        config.addDataSourceProperty("assumeMinServerVersion", "9.0");
        
        return new HikariDataSource(config);
    }
}
