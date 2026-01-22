#!/bin/bash
set -e

# Actualizar sistema
yum update -y

# Instalar Docker (Amazon Linux)
amazon-linux-extras install docker -y
systemctl start docker
systemctl enable docker
usermod -aG docker ec2-user

# Crear red usada por el sistema
docker network create scholarship-net || true

# Descargar imagen del API Gateway
docker pull wotklaus86682/api-gateway:qa

# Levantar API Gateway
docker run -d \
  --name api-gateway \
  --network scholarship-net \
  -p 8080:8080 \
  wotklaus86682/api-gateway:qa
