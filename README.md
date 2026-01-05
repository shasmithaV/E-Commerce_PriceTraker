🛒 SmartCompare — Full Stack E-Commerce & Price Comparison Platform

SmartCompare is a full-stack e-commerce web application built using Spring Boot, React, and MySQL, featuring secure authentication, role-based admin control, order management, analytics dashboards, and multi-platform price comparison.

This project was developed end-to-end to simulate real-world e-commerce workflows, including both user-facing and admin-facing systems.

🚀 Features
👤 User Features

User authentication using JWT

Browse products with pricing and stock details

Add products to cart and manage quantities

Checkout and place orders

View personal order history

Compare product prices with external platforms using interactive charts

Autocomplete search for faster product discovery

🧑‍💼 Admin Features

Secure admin dashboard (ROLE_ADMIN protected)

Manage products (update price & stock)

Automatic price history tracking on price updates

Manage and view all customer orders

Update order statuses

Add and manage external platform prices (Amazon, Flipkart, etc.)

View analytics (total orders, revenue, trends)

🏗️ Tech Stack
Frontend

React (Vite)

React Router

Axios

Chart.js / Recharts

CSS (custom styling)

Backend

Spring Boot

Spring Security (JWT Authentication)

JPA / Hibernate

RESTful APIs

Database

MySQL (Relational schema with proper relationships)

Deployment (Planned / In Progress)

Frontend: Netlify / Vercel

Backend: Render

Database: Railway MySQL

🔐 Authentication & Security

Stateless authentication using JWT

Role-based access control (ROLE_USER, ROLE_ADMIN)

Protected frontend routes using custom AdminRoute

Backend endpoint authorization using Spring Security

Secure handling of environment variables

📦 Core Business Logic

Cart → Order transactional flow

Stock validation during order placement

Stock reduction after successful orders

Cart auto-clear after checkout

BigDecimal usage for all monetary values (price safety)

Prevention of infinite JSON recursion using Jackson annotations

📊 Price Comparison System

External price comparison is implemented in a controlled and legal way.

Admin manually manages external platform prices

Backend stores platform-wise prices per product

Frontend popup allows:

Product search with autocomplete

Platform selection via checkboxes

Bar chart comparison (Our Store vs External Platforms)

This design avoids illegal scraping and mirrors enterprise price intelligence systems.

🧪 Testing Strategy

Backend API testing using Postman

Manual UI testing for:

User flows

Admin flows

Role-based access

Edge cases (empty cart, unauthorized access)

Validation of analytics and comparison features

🧠 Key Learnings

JWT-based authentication and authorization

Designing secure admin systems

Handling bidirectional JPA relationships safely

Preventing data loss during partial updates

Correct usage of React Hooks

Implementing real-world business flows

Building analytics-driven features

Preparing an application for production deployment


smartcompare-frontend/
 ├── src/
 │   ├── pages/
 │   ├── components/
 │   ├── api/
 │   └── styles/

smartcompare-backend/
 ├── controller/
 ├── service/
 ├── repository/
 ├── model/
 └── security/
