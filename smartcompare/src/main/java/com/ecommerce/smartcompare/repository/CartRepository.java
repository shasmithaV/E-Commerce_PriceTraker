package com.ecommerce.smartcompare.repository;

import com.ecommerce.smartcompare.model.Cart;
import com.ecommerce.smartcompare.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {

    // Find cart by User entity
    Optional<Cart> findByUser(User user);

    // Find cart by User ID
    Optional<Cart> findByUserId(Long userId);
}
