package com.ecommerce.smartcompare.controller;

import com.ecommerce.smartcompare.model.Cart;
import com.ecommerce.smartcompare.model.User;
import com.ecommerce.smartcompare.repository.CartRepository;
import com.ecommerce.smartcompare.repository.UserRepository;
import com.ecommerce.smartcompare.security.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final CartRepository cartRepository;



    public AuthController(UserRepository userRepository,
                      CartRepository cartRepository,
                      PasswordEncoder passwordEncoder,
                      JwtUtil jwtUtil) {
    this.userRepository = userRepository;
    this.cartRepository = cartRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtUtil = jwtUtil;
}


    // ========================= REGISTER =========================
    @PostMapping("/register")
        public ResponseEntity<Map<String, String>> register(@RequestBody User user) {

    // 1️⃣ Encode password
    user.setPassword(passwordEncoder.encode(user.getPassword()));

    // 2️⃣ Save user
    User savedUser = userRepository.save(user);

    // 3️⃣ CREATE CART FOR USER (🔥 THIS FIXES THE ERROR)
    Cart cart = new Cart();
    cart.setUser(savedUser);
    cartRepository.save(cart);

    return ResponseEntity.ok(
            Map.of("message", "User registered successfully")
    );
        }


    // ========================= LOGIN =========================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginUser) {

        Optional<User> userOpt = userRepository.findByEmail(loginUser.getEmail());

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid email or password"));
        }

        User user = userOpt.get();

        if (!passwordEncoder.matches(loginUser.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid email or password"));
        }

        // ✅ IMPORTANT: pass role AS-IS (ROLE_ADMIN / ROLE_USER)
        String accessToken = jwtUtil.generateAccessToken(
                user.getEmail(),
                user.getRole().name()
        );

        String refreshToken = jwtUtil.generateRefreshToken(user.getEmail());

        return ResponseEntity.ok(
                Map.of(
                        "accessToken", accessToken,
                        "refreshToken", refreshToken
                )
        );
    }

    // ========================= REFRESH TOKEN =========================
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody Map<String, String> request) {

        String refreshToken = request.get("refreshToken");

        if (refreshToken == null || !jwtUtil.validateToken(refreshToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid refresh token"));
        }

        String email = jwtUtil.extractEmail(refreshToken);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String newAccessToken = jwtUtil.generateAccessToken(
                user.getEmail(),
                user.getRole().name()
        );

        return ResponseEntity.ok(
                Map.of("accessToken", newAccessToken)
        );
    }
}
