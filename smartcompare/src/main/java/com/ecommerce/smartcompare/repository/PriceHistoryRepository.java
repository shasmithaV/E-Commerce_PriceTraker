package com.ecommerce.smartcompare.repository;

import com.ecommerce.smartcompare.model.PriceHistory;
import com.ecommerce.smartcompare.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PriceHistoryRepository
        extends JpaRepository<PriceHistory, Long> {

    List<PriceHistory> findByProductOrderByChangedAtDesc(Product product);
}
