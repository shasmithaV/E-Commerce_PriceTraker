package com.ecommerce.smartcompare.controller;

import com.ecommerce.smartcompare.model.ExternalPrice;
import com.ecommerce.smartcompare.model.Platform;
import com.ecommerce.smartcompare.service.ExternalPriceService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/external-prices")
@PreAuthorize("hasRole('ADMIN')")
public class AdminExternalPriceController {

    private final ExternalPriceService externalPriceService;

    public AdminExternalPriceController(ExternalPriceService externalPriceService) {
        this.externalPriceService = externalPriceService;
    }

    @PostMapping
    public ExternalPrice saveExternalPrice(
            @RequestParam Long productId,
            @RequestParam Platform platform,
            @RequestParam Double price
    ) {
        return externalPriceService.saveOrUpdatePrice(
                productId, platform, price
        );
    }
}
