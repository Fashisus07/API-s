package com.ecommerce.dto;

import jakarta.validation.constraints.*;

public class CreateCategoryDTO {
    @NotBlank(message = "El ID de la categoría es obligatorio")
    @Size(min = 2, max = 20, message = "El ID debe tener entre 2 y 20 caracteres")
    private String id;

    @NotBlank(message = "El nombre de la categoría es obligatorio")
    @Size(min = 2, max = 50, message = "El nombre debe tener entre 2 y 50 caracteres")
    private String name;

    @NotBlank(message = "La descripción es obligatoria")
    @Size(min = 5, max = 200, message = "La descripción debe tener entre 5 y 200 caracteres")
    private String description;

    public CreateCategoryDTO() {}

    public CreateCategoryDTO(String id, String name, String description) {
        this.id = id;
        this.name = name;
        this.description = description;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
