package com.ecommerce.smartcompare.service;

import com.ecommerce.smartcompare.model.*;
import com.ecommerce.smartcompare.repository.*;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ComparisonService {

    private final ProductRepository productRepository;
    private final ExternalPriceRepository externalPriceRepository;

    public ComparisonService(
            ProductRepository productRepository,
            ExternalPriceRepository externalPriceRepository
    ) {
        this.productRepository = productRepository;
        this.externalPriceRepository = externalPriceRepository;
    }

    public Map<String, Object> comparePrices(
            String productName,
            List<Platform> platforms
    ) {

        Product product = productRepository
                .findByNameIgnoreCase(productName)
                .orElseThrow(() ->
                        new RuntimeException("Product not found"));

        List<ExternalPrice> externalPrices =
                externalPriceRepository
                        .findByProductAndPlatformIn(product, platforms);

        List<Map<String, Object>> comparisons = new ArrayList<>();

        for (ExternalPrice ep : externalPrices) {
            comparisons.add(Map.of(
                    "platform", ep.getPlatform(),
                    "price", ep.getPrice()
            ));
        }

        return Map.of(
                "product", product.getName(),
                "ourPrice", product.getPrice(),
                "comparisons", comparisons
        );
    }
}
