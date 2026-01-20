# Notification Service – Scholarship Contract System

## Overview
The **Notification Service** is the user-facing communication microservice of the Scholarship Contract Management System.  
Its primary purpose is to deliver **asynchronous notifications** to users through **email** and **real-time dashboard alerts**, without introducing direct dependencies between microservices.

This service does **not** expose business APIs.  
Instead, it reacts to **events routed via RabbitMQ** and transforms them into user-readable notifications.

---

## Responsibilities
- Consume notification events from RabbitMQ
- Send transactional emails to users
- Publish real-time dashboard notifications via MQTT
- Centralize notification delivery logic
- Decouple business services from user communication
- Expose minimal endpoints for health and documentation

---

## Architecture

### Applied Architecture Pattern
- **Event-Driven Architecture (EDA)**
  - **Producers** emit domain events (Kafka)
  - **Event Bus** routes relevant events
  - **Notification Service** reacts asynchronously
  - **MQTT** delivers real-time frontend notifications

### Design Principles
- **Loose Coupling** – no direct HTTP calls from business services  
- **Single Responsibility Principle (SRP)** – only handles notifications  
- **Separation of Concerns** – business logic is fully isolated  
- **Asynchronous Communication** – non-blocking user feedback  
- **Scalability** – RabbitMQ consumers support horizontal scaling  

The Notification Service contains **no business rules**.  
It only reacts to events and delivers messages.

---

## Tech Stack
- **Framework**: NestJS  
- **Language**: TypeScript  
- **Message Broker**: RabbitMQ  
- **Real-Time Messaging**: MQTT (Mosquitto)  
- **Email Provider**: Nodemailer  
- **Runtime**: Node.js  
- **API Documentation**: http://localhost:3006/docs  

---

## Domain Events (Consumed)

| Routing Key | Description |
|------------|-------------|
| `notifications.user.logged.in` | User successfully logged in |
| `notifications.bank_certificate_uploaded` | Bank certificate uploaded and validated |
| `notifications.contract_signed` | Contract signed by the user |
| `notifications.contract_generated` | Contract finalized and stored |

These events allow user notifications **without synchronous HTTP coupling**.

---

## Real-Time Notifications (MQTT)

### Broker
- Eclipse Mosquitto

### Protocol
- MQTT over WebSocket

### Topic
