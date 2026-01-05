package com.ecommerce.smartcompare.controller;

import com.ecommerce.smartcompare.model.Platform;
import com.ecommerce.smartcompare.service.ComparisonService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/compare")
public class ComparisonController {

    private final ComparisonService comparisonService;

    public ComparisonController(ComparisonService comparisonService) {
        this.comparisonService = comparisonService;
    }

    @GetMapping
    public Map<String, Object> compare(
            @RequestParam String productName,
            @RequestParam List<Platform> platforms
    ) {
        return comparisonService.comparePrices(productName, platforms);
    }
}
