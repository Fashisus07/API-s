package com.ecommerce.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateProductDTO {
    @Size(min = 2, max = 100, message = "El nombre debe tener entre 2 y 100 caracteres")
    private String name;

    @Size(min = 10, max = 1000, message = "La descripción debe tener entre 10 y 1000 caracteres")
    private String description;

    @DecimalMin(value = "0.01", message = "El precio debe ser mayor a 0")
    private Double price;

    @Min(value = 0, message = "El stock no puede ser negativo")
    private Integer stock;

    private Long categoryId;
    private String imageUrl;
}
