package com.ecommerce.smartcompare.repository;

import com.ecommerce.smartcompare.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
}
