# Validation Service – Scholarship Contract System

## Overview
The **Validation Service** is responsible for parsing and validating uploaded documents.
In the current MVP scope, it focuses on **Bank Certificate parsing** to extract key banking fields that will later be stored by the Contracts Service.

This service is designed to be consumed by:
- The frontend (Next.js) via HTTP
- Other microservices through HTTP calls (later via API Gateway)

---

## Responsibilities
- Parse bank certificate PDFs (text-based PDFs)
- Extract:
  - bank name
  - account type
  - account number
  - identification (ID number)
  - holder name
- Provide a confidence score (heuristic)
- Expose a health endpoint for monitoring

---

## Architecture

### Applied Architecture Pattern
- **Layered Architecture**
  - **Controller layer**: HTTP endpoints
  - **Service layer**: parsing and validation logic

This service is intentionally kept synchronous and lightweight.
OCR for scanned PDFs is **out of scope** for the current MVP (future improvement).

### Design Principles
- Single Responsibility Principle (SRP)
- Separation of Concerns
- KISS (Keep It Simple, Stupid)
- DRY (Don’t Repeat Yourself)

---

## Tech Stack
- **Framework**: NestJS
- **Language**: TypeScript
- **PDF parsing**: pdfjs-dist (legacy build, Node-compatible)
- **API Documentation**: Swagger (OpenAPI)

---

## API Documentation (Swagger)
Swagger UI:
- `http://localhost:3003/docs`

---

## Endpoints

### Health check
- `GET /bank-certificate/health`

Response:
```json
{ "ok": true }
