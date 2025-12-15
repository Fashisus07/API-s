package com.ecommerce.service;

import com.ecommerce.dto.CreateProductDTO;
import com.ecommerce.dto.ProductDTO;
import com.ecommerce.dto.UpdateProductDTO;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.model.Category;
import com.ecommerce.model.Product;
import com.ecommerce.repository.CategoryRepository;
import com.ecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    private static final Logger logger = LoggerFactory.getLogger(ProductService.class);

    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public ProductDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto", "id", id));
        return convertToDTO(product);
    }

    public ProductDTO createProduct(CreateProductDTO createProductDTO) {
        logger.info("Creating product with data: {}", createProductDTO);
        Product product = convertToEntity(createProductDTO);
        try {
            Product savedProduct = productRepository.save(product);
            logger.info("Product created with id={} name={}", savedProduct.getId(), savedProduct.getName());
            return convertToDTO(savedProduct);
        } catch (Exception ex) {
            logger.error("Error saving product: {}", ex.getMessage(), ex);
            throw ex;
        }
    }

    public ProductDTO updateProduct(Long id, UpdateProductDTO updateProductDTO) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto", "id", id));

        updateProductFields(existingProduct, updateProductDTO);
        Product updatedProduct = productRepository.save(existingProduct);
        return convertToDTO(updatedProduct);
    }

    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Producto", "id", id);
        }
        productRepository.deleteById(id);
    }

    private ProductDTO convertToDTO(Product product) {
        return ProductDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .stock(product.getStock())
                .categoryId(product.getCategory().getId())
                .categoryName(product.getCategory().getName())
                .imageUrl(product.getImageUrl())
                .build();
    }

    @Transactional
    private Product convertToEntity(CreateProductDTO createProductDTO) {
        Category category = categoryRepository.findById(createProductDTO.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Categoría", "id", createProductDTO.getCategoryId()));

        return Product.builder()
                .name(createProductDTO.getName())
                .description(createProductDTO.getDescription())
                .price(createProductDTO.getPrice())
                .stock(createProductDTO.getStock())
                .category(category)
                .imageUrl(createProductDTO.getImageUrl())
                .build();
    }

    @Transactional
    private void updateProductFields(Product product, UpdateProductDTO updateProductDTO) {
        if (updateProductDTO.getName() != null) {
            product.setName(updateProductDTO.getName());
        }
        if (updateProductDTO.getDescription() != null) {
            product.setDescription(updateProductDTO.getDescription());
        }
        if (updateProductDTO.getPrice() != null) {
            product.setPrice(updateProductDTO.getPrice());
        }
        if (updateProductDTO.getStock() != null) {
            product.setStock(updateProductDTO.getStock());
        }
        if (updateProductDTO.getCategoryId() != null) {
            Category category = categoryRepository.findById(updateProductDTO.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Categoría", "id", updateProductDTO.getCategoryId()));
            product.setCategory(category);
        }
        if (updateProductDTO.getImageUrl() != null) {
            product.setImageUrl(updateProductDTO.getImageUrl());
        }
    }
}
