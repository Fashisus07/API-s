package com.ecommerce.controller;

import com.ecommerce.dto.*;
import com.ecommerce.service.UserProfileService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://localhost:3000")
public class UserProfileController {

    @Autowired
    private UserProfileService userProfileService;

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getProfile(@RequestHeader("Authorization") String token) {
        UserDTO user = userProfileService.getProfile(token);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/update")
    public ResponseEntity<UserDTO> updateProfile(@RequestHeader("Authorization") String token, 
                                                @Valid @RequestBody UpdateProfileDTO updateProfileDTO) {
        UserDTO updatedUser = userProfileService.updateProfile(token, updateProfileDTO);
        return ResponseEntity.ok(updatedUser);
    }

    @PostMapping("/upload-photo")
    public ResponseEntity<PhotoUploadResponseDTO> uploadPhoto(@RequestHeader("Authorization") String token,
                                                             @RequestParam("photo") MultipartFile file) {
        PhotoUploadResponseDTO response = userProfileService.uploadPhoto(token, file);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/change-password")
    public ResponseEntity<Void> changePassword(@RequestHeader("Authorization") String token,
                                              @Valid @RequestBody ChangePasswordDTO changePasswordDTO) {
        userProfileService.changePassword(token, changePasswordDTO);
        return ResponseEntity.noContent().build();
    }
}
