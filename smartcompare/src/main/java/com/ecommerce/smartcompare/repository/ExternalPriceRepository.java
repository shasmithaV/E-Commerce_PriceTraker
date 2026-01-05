package com.ecommerce.smartcompare.repository;

import com.ecommerce.smartcompare.model.ExternalPrice;
import com.ecommerce.smartcompare.model.Platform;
import com.ecommerce.smartcompare.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ExternalPriceRepository
        extends JpaRepository<ExternalPrice, Long> {

    List<ExternalPrice> findByProductAndPlatformIn(
            Product product,
            List<Platform> platforms
    );
    
    Optional<ExternalPrice> findByProductAndPlatform(
        Product product,
        Platform platform
);


}
