package com.ecommerce.smartcompare.service;

import com.ecommerce.smartcompare.model.*;
import com.ecommerce.smartcompare.repository.*;
import org.springframework.stereotype.Service;

@Service
public class ExternalPriceService {

    private final ExternalPriceRepository externalPriceRepository;
    private final ProductRepository productRepository;

    public ExternalPriceService(
            ExternalPriceRepository externalPriceRepository,
            ProductRepository productRepository
    ) {
        this.externalPriceRepository = externalPriceRepository;
        this.productRepository = productRepository;
    }

    public ExternalPrice saveOrUpdatePrice(
            Long productId,
            Platform platform,
            Double price
    ) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        ExternalPrice externalPrice = externalPriceRepository
                .findByProductAndPlatform(product, platform)
                .orElse(new ExternalPrice());

        externalPrice.setProduct(product);
        externalPrice.setPlatform(platform);
        externalPrice.setPrice(price);

        return externalPriceRepository.save(externalPrice);
    }
}
