package com.ecommerce.controller;

import com.ecommerce.dto.ChangePasswordRequestDTO;
import com.ecommerce.dto.UpdateProfileRequestDTO;
import com.ecommerce.dto.UserProfileDTO;
import com.ecommerce.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://localhost:3000")
public class UserProfileController {
    
    @Autowired
    private UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserProfileDTO> getProfile(Authentication authentication) {
        String email = authentication.getName();
        UserProfileDTO profile = userService.getProfile(email);
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/update")
    public ResponseEntity<Map<String, String>> updateProfile(Authentication authentication, 
                                         @RequestBody UpdateProfileRequestDTO request) {
        String email = authentication.getName();
        userService.updateProfile(email, request);
        return ResponseEntity.ok(Map.of("message", "Perfil actualizado correctamente"));
    }

    @PostMapping("/upload-photo")
    public ResponseEntity<Map<String, String>> uploadPhoto(Authentication authentication,
                                       @RequestParam("photo") MultipartFile file) {
        String email = authentication.getName();
        String photoUrl = userService.uploadPhoto(email, file);
        return ResponseEntity.ok(Map.of(
            "message", "Foto de perfil actualizada correctamente",
            "profilePhoto", photoUrl
        ));
    }

    @PutMapping("/change-password")
    public ResponseEntity<Map<String, String>> changePassword(Authentication authentication,
                                          @RequestBody ChangePasswordRequestDTO request) {
        String email = authentication.getName();
        userService.changePassword(email, request);
        return ResponseEntity.ok(Map.of("message", "Contraseña cambiada correctamente"));
    }
}
