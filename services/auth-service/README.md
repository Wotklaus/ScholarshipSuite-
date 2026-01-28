# Auth Service – Scholarship Contract System

## Overview
The **Auth Service** is a microservice responsible for user authentication and access control within the Scholarship Contract Management System.  
It provides secure login functionality, JWT token generation, and enforces basic security policies such as rate limiting and CORS.

This service is designed to be consumed by other microservices and frontend applications through HTTP requests and cookies.

---

## Responsibilities
- User authentication (login)
- JWT token generation
- Role propagation inside JWT payload
- Secure session handling using HttpOnly cookies
- Rate limiting to prevent brute-force attacks
- Health check endpoint for monitoring

---

## Architecture

### Applied Architecture Pattern
- **Layered Architecture (MVC-inspired)**
  - **Controller layer**: Handles HTTP requests and responses
  - **Service layer**: Contains authentication business logic
  - **Repository layer**: Database access via TypeORM

### Design Principles
- Single Responsibility Principle (SRP)
- Separation of Concerns
- DRY (Don’t Repeat Yourself)
- KISS (Keep It Simple, Stupid)

This microservice intentionally avoids unnecessary complexity such as CQRS or Event-Driven patterns, since authentication is a synchronous and transactional concern.

---

## Tech Stack
- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT
- **Password Hashing**: bcrypt
- **Rate Limiting**: @nestjs/throttler
- **API Documentation**: Swagger (OpenAPI)

---

## API Documentation
Swagger UI is available at:

http://localhost:3000/docs

