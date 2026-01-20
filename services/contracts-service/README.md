# Contracts Service – Scholarship Contract System

## Overview
The **Contracts Service** is a microservice responsible for generating scholarship contracts in PDF format, handling bank certificate uploads, and finalizing signed contracts inside the Scholarship Contract Management System.

It is consumed by the frontend (Next.js) through HTTP endpoints and uses JWT authentication via HttpOnly cookies.

---

## Responsibilities
- Generate **dynamic contract PDF preview** using institutional data
- Upsert and persist **bank account data** for the logged scholar
- Store **bank certificate PDF on disk** + metadata in database
- Allow downloading the latest uploaded bank certificate (user/admin routes)
- Finalize the contract by generating the final PDF and storing it as **BYTEA** in `contracts.file`
- Set contract status to **signed** and store signature hash as a mock blockchain hash (`contracts.blockchain_hash`)

---

## Architecture

### Applied Architecture Pattern
- **Layered Architecture (MVC-inspired)**
  - **Controller layer**: REST endpoints, cookie token extraction, request orchestration
  - **Service layer**: contract generation + banking + finalization business logic
  - **Repository layer**: persistence via TypeORM repositories

### Design Principles
- Single Responsibility Principle (SRP)
- Separation of Concerns
- DRY (Don’t Repeat Yourself)
- KISS (Keep It Simple, Stupid)

This microservice is intentionally synchronous and transactional, so it avoids unnecessary complexity such as CQRS or event-driven patterns.

---

## Tech Stack
- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT (HttpOnly cookie)
- **PDF Generation**: Handlebars + Puppeteer
- **File Uploads**: Multer (memory storage)
- **Static Assets**: ServeStaticModule (templates exposed via `/static`)
- **API Documentation**: Swagger (OpenAPI)

---

## API Documentation
Swagger UI is available at:

http://localhost:3002/docs

