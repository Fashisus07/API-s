package com.ecommerce.controller;

import com.ecommerce.model.User;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> req) {
        if (userRepository.existsByEmail(req.get("email"))) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email ya registrado"));
        }
        if (userRepository.existsByUsername(req.get("username"))) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username ya registrado"));
        }
        User user = new User();
        user.setUsername(req.get("username"));
        user.setEmail(req.get("email"));
        user.setPassword(passwordEncoder.encode(req.get("password")));
        user.setFirstName(req.get("firstName"));
        user.setLastName(req.get("lastName"));
        user.setRole("user");
        user.setCreatedAt(LocalDateTime.now());
        user.setIsActive(true);
        userRepository.save(user);
        String token = jwtUtil.generateToken(user.getEmail(), Set.of(user.getRole()));
        return ResponseEntity.ok(Map.of(
            "token", token, 
            "username", user.getUsername(),
            "firstName", user.getFirstName(),
            "lastName", user.getLastName(),
            "email", user.getEmail(),
            "role", user.getRole()
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> req) {
        Optional<User> userOpt = userRepository.findByEmail(req.get("email"));
        if (userOpt.isEmpty() || !passwordEncoder.matches(req.get("password"), userOpt.get().getPassword())) {
            return ResponseEntity.status(401).body(Map.of("error", "Credenciales inválidas"));
        }
        User user = userOpt.get();
        if (!user.getIsActive()) {
            return ResponseEntity.status(401).body(Map.of("error", "Usuario inactivo"));
        }
        String token = jwtUtil.generateToken(user.getEmail(), Set.of(user.getRole()));
        return ResponseEntity.ok(Map.of(
            "token", token, 
            "username", user.getUsername(),
            "firstName", user.getFirstName(),
            "lastName", user.getLastName(),
            "email", user.getEmail(),
            "role", user.getRole(),
            "profilePhoto", user.getProfilePhoto()
        ));
    }
}
