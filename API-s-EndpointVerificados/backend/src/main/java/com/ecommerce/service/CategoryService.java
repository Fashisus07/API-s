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

    public CategoryDTO getCategoryById(String id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoría", "id", id));
        return convertToDTO(category);
    }

    public CategoryDTO createCategory(CreateCategoryDTO createCategoryDTO) {
        if (categoryRepository.existsById(createCategoryDTO.getId())) {
            throw new BadRequestException("Ya existe una categoría con el ID: " + createCategoryDTO.getId());
        }

        Category category = convertToEntity(createCategoryDTO);
        Category savedCategory = categoryRepository.save(category);
        return convertToDTO(savedCategory);
    }

    public CategoryDTO updateCategory(String id, UpdateCategoryDTO updateCategoryDTO) {
        Category existingCategory = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoría", "id", id));

        updateCategoryFields(existingCategory, updateCategoryDTO);
        Category updatedCategory = categoryRepository.save(existingCategory);
        return convertToDTO(updatedCategory);
    }

    public void deleteCategory(String id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Categoría", "id", id);
        }
        categoryRepository.deleteById(id);
    }

    private CategoryDTO convertToDTO(Category category) {
        return new CategoryDTO(
                category.getId(),
                category.getName(),
                category.getDescription()
        );
    }

    private Category convertToEntity(CreateCategoryDTO createCategoryDTO) {
        Category category = new Category();
        category.setId(createCategoryDTO.getId());
        category.setName(createCategoryDTO.getName());
        category.setDescription(createCategoryDTO.getDescription());
        return category;
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
