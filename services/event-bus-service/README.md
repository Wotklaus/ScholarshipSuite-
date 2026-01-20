# Event Bus Service – Scholarship Contract System

## Overview
The **Event Bus Service** is the central event-routing microservice of the Scholarship Contract Management System.  
Its primary purpose is to enable **asynchronous communication** between all microservices through **Apache Kafka**, ensuring loose coupling, scalability, and reliable message delivery.

This service does **not** expose business APIs.  
Instead, it manages **publishing and consuming domain events** that other microservices rely on to coordinate workflows.

---

## Responsibilities
- Act as the **message hub** of the platform
- Establish a shared Kafka producer and consumer
- Publish domain events emitted by other microservices
- Listen for specific event topics and trigger internal callbacks
- Provide a unified communication layer for the entire system
- Expose a minimal **health check endpoint** for monitoring

---

## Architecture

### Applied Architecture Pattern
- **Event-Driven Architecture (EDA)**
  - **Producers** publish events to Kafka topics
  - **Consumers** subscribe to events and react asynchronously
  - **Event Bus** provides the shared infrastructure to facilitate communication
  - Events are forwarded to RabbitMQ when notification delivery is required
  - MQTT is used downstream to notify frontend clients in real time

### Design Principles
- **Loose Coupling** – microservices do not directly call each other  
- **High Scalability** – Kafka manages large volumes of events  
- **Single Responsibility Principle (SRP)** – only handles event transport  
- **Separation of Concerns** – event routing is isolated from business logic  
- **Fail-Safe Communication** – resilient consumer groups via Kafka  

The Event Bus is intentionally minimal.  
It avoids business logic and focuses on reliable event delivery only.

---

## Tech Stack
- **Framework**: NestJS  
- **Language**: TypeScript  
- **Message Broker**: Apache Kafka  
- **Client Library**: kafkajs  
- **Routing Broker**: RabbitMQ  
- **Real-Time Messaging**: MQTT (Mosquitto)  
- **Kafka Client**: kafkajs  
- **Runtime**: Node.js  
- **API Documentation**: http://localhost:3005/docs

---

## Domain Events
The Event Bus handles the following topics across the system:

| Topic | Description |
|-------|-------------|
| `user.logged_in` | Emitted when a user logs into the platform |
| `documents.bank_certificate_uploaded` | Certificate extracted and validated |
| `signatures.completed` | Contract signature completed by a user |
| `contracts.generated` | Contract finalized and stored |

These events enable microservices to react without direct HTTP coupling.

---

## API Documentation

http://localhost:3005/docs

### **Health Check Endpoint**

http://localhost:3005/health

