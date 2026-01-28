# Analytics Service – Scholarship Contract System

## Overview
The **Analytics Service** is a read-model and projection microservice within the Scholarship Contract Management System.

Its primary responsibility is to provide **fast, optimized, and query-ready views** of system state by consuming **domain events** and storing **aggregated projections** in **Redis**.

This service **does not own business logic**, **does not write to relational databases**, and **does not expose transactional APIs**.  
It exists purely to support **CQRS**, **event-driven analytics**, and **high-performance reads**.

---

## Responsibilities
- Consume domain events from Kafka
- Build read-model projections from events
- Store aggregated state in Redis
- Provide fast query endpoints for frontend and dashboards
- Decouple read operations from transactional services
- Act as a cache-backed analytics and query service
- Expose minimal APIs for health checks and read access

---

## Architecture

### Applied Architecture Patterns

#### Event-Driven Architecture (EDA)
- Business services emit domain events (Kafka)
- Analytics Service subscribes to relevant topics
- State is derived **only from events**
- No direct coupling with producers

#### CQRS (Command Query Responsibility Segregation)
- **Commands** are handled by business services
- **Queries** are handled by Analytics Service
- Redis acts as a read-optimized data store
- Write and read concerns are fully separated

#### Cache-as-Read-Model Pattern
- Redis is not used as a simple cache
- It stores **event-derived projections**
- State can be rebuilt from the event log if needed

---

## Design Principles
- **Single Responsibility Principle (SRP)** – only analytics and read models
- **Asynchronous Communication** – Kafka-based event consumption
- **Scalability** – Redis-backed reads and Kafka consumer groups
- **Fault Tolerance** – projections can be rebuilt from events

---

## Tech Stack
- **Framework**: NestJS
- **Language**: TypeScript
- **Message Broker**: Apache Kafka
- **Cache / Read Store**: Redis
- **Configuration**: @nestjs/config
- **Runtime**: Node.js
- **API Documentation**: http://localhost:3009/docs

---

## Data Storage Strategy

### Redis Usage
Redis stores **aggregated contract summaries** derived from events.

Example logical structure:
