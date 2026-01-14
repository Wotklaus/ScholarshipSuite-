# Signature Service – Scholarship Contract System

## Overview

The **Signature Service** is a microservice responsible for handling the **contract signature workflow** within the Scholarship Contract Management System.

It simulates both **electronic** and **manual** signature processes, allowing contracts to move from a pending state to a signed state while ensuring traceability, auditability, and future integration with real digital signature providers or blockchain systems.

This service is intentionally implemented as a **mock signature provider**, focusing on workflow correctness and system integration rather than legal-grade cryptographic signing.

---

## Responsibilities

- Start a signature process for a contract
- Support multiple signature methods:
  - Electronic signature (mock challenge-based flow)
  - Manual signature (physical signing simulation)
- Confirm signatures and update their status
- Generate a unique signature hash (receipt)
- Expose signature status for other services (contracts, audit, frontend)
- Enforce authentication via JWT (cookies)

---

## Architecture

### Applied Architecture Pattern

- **Layered Architecture (Controller – Service – Persistence)**
- **Hexagonal-inspired boundaries**
  - Controllers act as inbound adapters
  - Services contain business logic
  - Database entities represent persistence adapters

This microservice is **intentionally synchronous**, as signing is a transactional user-driven action.

---

### Design Principles

- **Single Responsibility Principle (SRP)**
- **Separation of Concerns**
- **KISS (Keep It Simple, Stupid)**
- **YAGNI (You Aren’t Gonna Need It)**
- **Low Coupling / High Cohesion**

---

## Signature Workflow

### Electronic Signature (Mock)

1. User starts signature process
2. System generates a temporary challenge code
3. User confirms signature using the code
4. System:
   - Marks signature as `SIGNED`
   - Generates a SHA-256 receipt hash
   - Stores signing timestamp

### Manual Signature

1. User starts signature process with `MANUAL` method
2. No challenge code is generated
3. User confirms signature directly
4. System stores signature metadata and receipt hash

---

## Tech Stack

- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT (cookie-based)
- **Hashing**: Node.js `crypto` (SHA-256)
- **API Documentation**: Swagger (OpenAPI)

---

## API Documentation

Swagger UI is available at:

http://localhost:3004/docs
