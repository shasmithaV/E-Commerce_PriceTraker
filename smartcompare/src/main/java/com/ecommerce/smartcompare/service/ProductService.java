package com.ecommerce.smartcompare.service;

import com.ecommerce.smartcompare.model.PriceHistory;
import com.ecommerce.smartcompare.model.Product;
import com.ecommerce.smartcompare.repository.PriceHistoryRepository;
import com.ecommerce.smartcompare.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final PriceHistoryRepository priceHistoryRepository;

    public ProductService(ProductRepository productRepository,
                          PriceHistoryRepository priceHistoryRepository) {
        this.productRepository = productRepository;
        this.priceHistoryRepository = priceHistoryRepository;
    }

    // ================= ADMIN =================

    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, Product updatedProduct) {

    Product product = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Product not found"));

    if (updatedProduct.getPrice() != null &&
        !product.getPrice().equals(updatedProduct.getPrice())) {

        PriceHistory history = new PriceHistory();
        history.setOldPrice(product.getPrice());
        history.setNewPrice(updatedProduct.getPrice());
        history.setChangedAt(LocalDateTime.now());
        product.setPrice(updatedProduct.getPrice());

        priceHistoryRepository.save(history);
    }

    

    if (updatedProduct.getStock() != null) {
        product.setStock(updatedProduct.getStock());
    }

    return productRepository.save(product);
}



    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    // ================= USER =================

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    // ================= PRICE HISTORY =================


// ================= PRICE HISTORY =================
public List<PriceHistory> getPriceHistory(Long productId) {

    Product product = productRepository.findById(productId)
            .orElseThrow(() -> new RuntimeException("Product not found"));

    return priceHistoryRepository
            .findByProductOrderByChangedAtDesc(product);
}



}
