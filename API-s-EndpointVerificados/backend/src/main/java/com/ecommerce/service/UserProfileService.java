package com.ecommerce.service;

import com.ecommerce.dto.*;
import com.ecommerce.exception.BadRequestException;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.exception.UnauthorizedException;
import com.ecommerce.model.User;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class UserProfileService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    private final String UPLOAD_DIR = "uploads/profiles/";

    public UserDTO getProfile(String token) {
        String email = extractEmailFromToken(token);
        User user = getUserByEmail(email);
        return convertToUserDTO(user);
    }

    public UserDTO updateProfile(String token, UpdateProfileDTO updateProfileDTO) {
        String email = extractEmailFromToken(token);
        User user = getUserByEmail(email);

        if (updateProfileDTO.getFirstName() != null) {
            user.setFirstName(updateProfileDTO.getFirstName());
        }
        if (updateProfileDTO.getLastName() != null) {
            user.setLastName(updateProfileDTO.getLastName());
        }
        if (updateProfileDTO.getUsername() != null) {
            if (userRepository.existsByUsername(updateProfileDTO.getUsername()) && 
                !user.getUsername().equals(updateProfileDTO.getUsername())) {
                throw new BadRequestException("El nombre de usuario ya está en uso");
            }
            user.setUsername(updateProfileDTO.getUsername());
        }

        User savedUser = userRepository.save(user);
        return convertToUserDTO(savedUser);
    }

    public PhotoUploadResponseDTO uploadPhoto(String token, MultipartFile file) {
        String email = extractEmailFromToken(token);
        User user = getUserByEmail(email);

        if (file.isEmpty()) {
            throw new BadRequestException("No se seleccionó ningún archivo");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new BadRequestException("Solo se permiten archivos de imagen");
        }

        try {
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath);

            user.setProfilePhoto("/uploads/profiles/" + fileName);
            userRepository.save(user);

            return new PhotoUploadResponseDTO(
                "Foto de perfil actualizada correctamente",
                user.getProfilePhoto()
            );
        } catch (IOException e) {
            throw new RuntimeException("Error al guardar el archivo", e);
        }
    }

    public void changePassword(String token, ChangePasswordDTO changePasswordDTO) {
        String email = extractEmailFromToken(token);
        User user = getUserByEmail(email);

        if (!passwordEncoder.matches(changePasswordDTO.getCurrentPassword(), user.getPassword())) {
            throw new BadRequestException("Contraseña actual incorrecta");
        }

        user.setPassword(passwordEncoder.encode(changePasswordDTO.getNewPassword()));
        userRepository.save(user);
    }

    private String extractEmailFromToken(String token) {
        try {
            return jwtUtil.extractEmail(token.replace("Bearer ", ""));
        } catch (Exception e) {
            throw new UnauthorizedException("Token inválido");
        }
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", "email", email));
    }

    private UserDTO convertToUserDTO(User user) {
        return new UserDTO(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getRole(),
                user.getCreatedAt(),
                user.getIsActive(),
                user.getProfilePhoto()
        );
    }
}
