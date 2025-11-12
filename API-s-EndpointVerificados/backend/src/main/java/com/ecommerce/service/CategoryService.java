package com.ecommerce.service;

import com.ecommerce.dto.CategoryDTO;
import com.ecommerce.dto.CreateCategoryDTO;
import com.ecommerce.dto.UpdateCategoryDTO;
import com.ecommerce.exception.BadRequestException;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.model.Category;
import com.ecommerce.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public CategoryDTO getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoría", "id", id));
        return convertToDTO(category);
    }

    public CategoryDTO createCategory(CreateCategoryDTO createCategoryDTO) {
        if (categoryRepository.existsByName(createCategoryDTO.getName())) {
            throw new BadRequestException("Ya existe una categoría con el nombre: " + createCategoryDTO.getName());
        }

        Category category = convertToEntity(createCategoryDTO);
        Category savedCategory = categoryRepository.save(category);
        return convertToDTO(savedCategory);
    }

    public CategoryDTO updateCategory(Long id, UpdateCategoryDTO updateCategoryDTO) {
        Category existingCategory = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoría", "id", id));

        updateCategoryFields(existingCategory, updateCategoryDTO);
        Category updatedCategory = categoryRepository.save(existingCategory);
        return convertToDTO(updatedCategory);
    }

    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Categoría", "id", id);
        }
        categoryRepository.deleteById(id);
    }

    private CategoryDTO convertToDTO(Category category) {
        return CategoryDTO.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .productCount(category.getProducts().size())
                .build();
    }

    private Category convertToEntity(CreateCategoryDTO createCategoryDTO) {
        return Category.builder()
                .name(createCategoryDTO.getName())
                .description(createCategoryDTO.getDescription())
                .build();
    }

    private void updateCategoryFields(Category category, UpdateCategoryDTO updateCategoryDTO) {
        if (updateCategoryDTO.getName() != null) {
            category.setName(updateCategoryDTO.getName());
        }
        if (updateCategoryDTO.getDescription() != null) {
            category.setDescription(updateCategoryDTO.getDescription());
        }
    }
}
