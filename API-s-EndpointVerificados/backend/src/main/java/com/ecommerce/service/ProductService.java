package com.ecommerce.service;

import com.ecommerce.dto.CreateProductDTO;
import com.ecommerce.dto.ProductDTO;
import com.ecommerce.dto.UpdateProductDTO;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.model.Product;
import com.ecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

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
        Product product = convertToEntity(createProductDTO);
        Product savedProduct = productRepository.save(product);
        return convertToDTO(savedProduct);
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
        return new ProductDTO(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getStock(),
                product.getCategory(),
                product.getImageUrl()
        );
    }

    private Product convertToEntity(CreateProductDTO createProductDTO) {
        Product product = new Product();
        product.setName(createProductDTO.getName());
        product.setDescription(createProductDTO.getDescription());
        product.setPrice(createProductDTO.getPrice());
        product.setStock(createProductDTO.getStock());
        product.setCategory(createProductDTO.getCategory());
        product.setImageUrl(createProductDTO.getImageUrl());
        return product;
    }

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
        if (updateProductDTO.getCategory() != null) {
            product.setCategory(updateProductDTO.getCategory());
        }
        if (updateProductDTO.getImageUrl() != null) {
            product.setImageUrl(updateProductDTO.getImageUrl());
        }
    }
}
