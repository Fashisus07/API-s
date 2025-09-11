package com.ecommerce.controller;

import com.ecommerce.model.User;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

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
        if (userRepository.existsByDni(req.get("dni"))) {
            return ResponseEntity.badRequest().body(Map.of("error", "DNI ya registrado"));
        }
        User user = new User();
        user.setEmail(req.get("email"));
        user.setPassword(passwordEncoder.encode(req.get("password")));
        user.setName(req.get("name"));
        user.setSurname(req.get("surname"));
        user.setDni(req.get("dni"));
        user.setRoles(Set.of("USER"));
        userRepository.save(user);
        String token = jwtUtil.generateToken(user.getEmail(), user.getRoles());
        return ResponseEntity.ok(Map.of(
            "token", token, 
            "name", user.getName(),
            "surname", user.getSurname(),
            "email", user.getEmail(),
            "dni", user.getDni()
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> req) {
        Optional<User> userOpt = userRepository.findByEmail(req.get("email"));
        if (userOpt.isEmpty() || !passwordEncoder.matches(req.get("password"), userOpt.get().getPassword())) {
            return ResponseEntity.status(401).body(Map.of("error", "Credenciales inválidas"));
        }
        User user = userOpt.get();
        String token = jwtUtil.generateToken(user.getEmail(), user.getRoles());
        return ResponseEntity.ok(Map.of(
            "token", token, 
            "name", user.getName(),
            "surname", user.getSurname(),
            "email", user.getEmail(),
            "dni", user.getDni(),
            "profilePhoto", user.getProfilePhoto()
        ));
    }
}
