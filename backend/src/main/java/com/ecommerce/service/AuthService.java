package com.ecommerce.service;

import com.ecommerce.dto.AuthResponseDTO;
import com.ecommerce.dto.LoginRequestDTO;
import com.ecommerce.dto.RegisterRequestDTO;
import com.ecommerce.exception.DuplicateResourceException;
import com.ecommerce.model.User;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.Set;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Transactional
    public AuthResponseDTO register(RegisterRequestDTO request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email ya registrado");
        }
        if (userRepository.existsByDni(request.getDni())) {
            throw new DuplicateResourceException("DNI ya registrado");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setName(request.getName());
        user.setSurname(request.getSurname());
        user.setDni(request.getDni());
        user.setRoles(Set.of("USER"));
        
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail(), user.getRoles());
        
        return new AuthResponseDTO(
            token,
            user.getName(),
            user.getSurname(),
            user.getEmail(),
            user.getDni(),
            user.getProfilePhoto()
        );
    }

    public AuthResponseDTO login(LoginRequestDTO request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        
        if (userOpt.isEmpty() || !passwordEncoder.matches(request.getPassword(), userOpt.get().getPassword())) {
            throw new BadCredentialsException("Credenciales inválidas");
        }

        User user = userOpt.get();
        String token = jwtUtil.generateToken(user.getEmail(), user.getRoles());
        
        return new AuthResponseDTO(
            token,
            user.getName(),
            user.getSurname(),
            user.getEmail(),
            user.getDni(),
            user.getProfilePhoto()
        );
    }
}
