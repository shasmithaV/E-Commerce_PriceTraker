package com.ecommerce.smartcompare.repository;

import com.ecommerce.smartcompare.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
}
