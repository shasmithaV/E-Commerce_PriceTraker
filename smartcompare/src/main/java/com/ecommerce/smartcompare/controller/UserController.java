package com.ecommerce.smartcompare.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @GetMapping("/hello")
    public String userHello() {
        return "Hello USER – JWT WORKS";
    }
}
