package com.ecommerce.controller;

import com.ecommerce.model.User;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://localhost:3000")
public class UserProfileController {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtUtil jwtUtil;

    private final String UPLOAD_DIR = "uploads/profiles/";

    @GetMapping("/me")
    public ResponseEntity<?> getProfile(@RequestHeader("Authorization") String token) {
        try {
            String email = jwtUtil.extractEmail(token.replace("Bearer ", ""));
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(404).body(Map.of("error", "Usuario no encontrado"));
            }
            User user = userOpt.get();
            return ResponseEntity.ok(Map.of(
                "username", user.getUsername(),
                "firstName", user.getFirstName(),
                "lastName", user.getLastName(),
                "email", user.getEmail(),
                "role", user.getRole(),
                "profilePhoto", user.getProfilePhoto(),
                "isActive", user.getIsActive(),
                "createdAt", user.getCreatedAt()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", "Token inválido"));
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateProfile(@RequestHeader("Authorization") String token, 
                                         @RequestBody Map<String, String> req) {
        try {
            String email = jwtUtil.extractEmail(token.replace("Bearer ", ""));
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(404).body(Map.of("error", "Usuario no encontrado"));
            }
            
            User user = userOpt.get();
            if (req.get("firstName") != null) user.setFirstName(req.get("firstName"));
            if (req.get("lastName") != null) user.setLastName(req.get("lastName"));
            if (req.get("username") != null) {
                // Verificar que el username no esté en uso por otro usuario
                if (userRepository.existsByUsername(req.get("username")) && 
                    !user.getUsername().equals(req.get("username"))) {
                    return ResponseEntity.badRequest().body(Map.of("error", "Username ya está en uso"));
                }
                user.setUsername(req.get("username"));
            }
            
            userRepository.save(user);
            return ResponseEntity.ok(Map.of("message", "Perfil actualizado correctamente"));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", "Token inválido"));
        }
    }

    @PostMapping("/upload-photo")
    public ResponseEntity<?> uploadPhoto(@RequestHeader("Authorization") String token,
                                       @RequestParam("photo") MultipartFile file) {
        try {
            String email = jwtUtil.extractEmail(token.replace("Bearer ", ""));
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(404).body(Map.of("error", "Usuario no encontrado"));
            }

            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "No se seleccionó ningún archivo"));
            }

            // Validar tipo de archivo
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest().body(Map.of("error", "Solo se permiten archivos de imagen"));
            }

            // Crear directorio si no existe
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generar nombre único para el archivo
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);

            // Guardar archivo
            Files.copy(file.getInputStream(), filePath);

            // Actualizar usuario
            User user = userOpt.get();
            user.setProfilePhoto("/uploads/profiles/" + fileName);
            userRepository.save(user);

            return ResponseEntity.ok(Map.of(
                "message", "Foto de perfil actualizada correctamente",
                "profilePhoto", user.getProfilePhoto()
            ));
        } catch (IOException e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al guardar el archivo"));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", "Token inválido"));
        }
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestHeader("Authorization") String token,
                                          @RequestBody Map<String, String> req) {
        try {
            String email = jwtUtil.extractEmail(token.replace("Bearer ", ""));
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(404).body(Map.of("error", "Usuario no encontrado"));
            }

            User user = userOpt.get();
            
            // Verificar contraseña actual
            if (!passwordEncoder.matches(req.get("currentPassword"), user.getPassword())) {
                return ResponseEntity.badRequest().body(Map.of("error", "Contraseña actual incorrecta"));
            }

            // Validar nueva contraseña
            String newPassword = req.get("newPassword");
            if (newPassword == null || newPassword.length() < 6) {
                return ResponseEntity.badRequest().body(Map.of("error", "La nueva contraseña debe tener al menos 6 caracteres"));
            }

            // Actualizar contraseña
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);

            return ResponseEntity.ok(Map.of("message", "Contraseña cambiada correctamente"));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", "Token inválido"));
        }
    }
}
