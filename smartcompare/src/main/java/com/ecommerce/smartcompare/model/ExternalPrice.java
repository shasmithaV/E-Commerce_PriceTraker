package com.ecommerce.smartcompare.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "external_prices",
    uniqueConstraints = @UniqueConstraint(
        columnNames = {"product_id", "platform"}
    )
)
public class ExternalPrice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "product_id")
    private Product product;

    @Enumerated(EnumType.STRING)
    private Platform platform;

    private Double price;

    private LocalDateTime lastUpdated;

    @PrePersist
    @PreUpdate
    public void onSave() {
        this.lastUpdated = LocalDateTime.now();
    }

    // ================= GETTERS =================

    public Long getId() {
        return id;
    }

    public Product getProduct() {
        return product;
    }

    public Platform getPlatform() {
        return platform;
    }

    public Double getPrice() {
        return price;
    }

    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }

    // ================= SETTERS =================

    public void setId(Long id) {
        this.id = id;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public void setPlatform(Platform platform) {
        this.platform = platform;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public void setLastUpdated(LocalDateTime lastUpdated) {
        this.lastUpdated = lastUpdated;
    }
}
