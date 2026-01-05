package com.ecommerce.smartcompare.service;

import com.ecommerce.smartcompare.model.*;
import com.ecommerce.smartcompare.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public CartService(
            CartRepository cartRepository,
            CartItemRepository cartItemRepository,
            ProductRepository productRepository,
            UserRepository userRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    // 🟢 Get or Create Cart
    public Cart getCart(User user) {
        return cartRepository.findByUser(user)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    return cartRepository.save(newCart);
                });
    }

    // 🟢 Add to Cart
    @Transactional
public Cart addToCart(Long userId, Long productId, int quantity) {

    User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

    Cart cart = cartRepository.findByUser(user)
            .orElseGet(() -> {
                Cart newCart = new Cart();
                newCart.setUser(user);
                return cartRepository.save(newCart);
            });

    Product product = productRepository.findById(productId)
            .orElseThrow(() -> new RuntimeException("Product not found"));

    // 🔁 If product already exists
    for (CartItem item : cart.getItems()) {
        if (item.getProduct().getId().equals(productId)) {
            item.setQuantity(item.getQuantity() + quantity);
            cartItemRepository.save(item); // ✅ SAVE
            return cart;
        }
    }

    // 🆕 New CartItem
    CartItem cartItem = new CartItem();
    cartItem.setCart(cart);
    cartItem.setProduct(product);
    cartItem.setQuantity(quantity);

    cartItemRepository.save(cartItem); // ✅ MUST SAVE

    cart.getItems().add(cartItem);

    return cart;
}


    // 🟢 Remove from Cart
    @Transactional
    public Cart removeFromCart(User user, Long productId) {
        Cart cart = getCart(user);

        CartItem toRemove = null;
        for (CartItem item : cart.getItems()) {
            if (item.getProduct().getId().equals(productId)) {
                toRemove = item;
                break;
            }
        }

        if (toRemove != null) {
            cart.getItems().remove(toRemove);
            cartItemRepository.delete(toRemove); // ensures deletion in DB
        }

        return cartRepository.save(cart);
    }
}
