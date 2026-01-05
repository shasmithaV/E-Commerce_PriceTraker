package com.ecommerce.smartcompare.controller;

import com.ecommerce.smartcompare.dto.CartRequest;
import com.ecommerce.smartcompare.model.Cart;
import com.ecommerce.smartcompare.model.User;
import com.ecommerce.smartcompare.repository.UserRepository;
import com.ecommerce.smartcompare.service.CartService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/cart")
@PreAuthorize("hasRole('USER')")
public class CartController {

    private final CartService cartService;
    private final UserRepository userRepository;

    public CartController(CartService cartService, UserRepository userRepository) {
        this.cartService = cartService;
        this.userRepository = userRepository;
    }

    private User getLoggedInUser(Principal principal) {
        return userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // 🛒 View Cart
    @GetMapping
    public Cart viewCart(Principal principal) {
        return cartService.getCart(getLoggedInUser(principal));
    }

    // ➕ Add to Cart
    @PostMapping("/add")
    public Cart addToCart(
        @RequestBody CartRequest request,
        Principal principal
) {
    User user = getLoggedInUser(principal);
    return cartService.addToCart(
            user.getId(),
            request.getProductId(),
            request.getQuantity()
    );
}



    // ➖ Remove from Cart
    @DeleteMapping("/remove")
    public Cart removeFromCart(
            @RequestParam Long productId,
            Principal principal
    ) {
        return cartService.removeFromCart(
                getLoggedInUser(principal),
                productId
        );
    }
}
