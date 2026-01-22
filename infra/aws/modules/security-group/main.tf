#################################
# SECURITY GROUP - BASTION
#################################
resource "aws_security_group" "bastion" {
  name        = "bastion-security-group"
  description = "SSH access to bastion host"
  vpc_id      = var.vpc_id

  ingress {
    description = "SSH from admin IP"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.allowed_ssh_cidr]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(var.tags, {
    Name = "sg-bastion"
    Role = "bastion"
  })
}

#################################
# SECURITY GROUP - ALB
#################################
resource "aws_security_group" "alb" {
  name        = "alb-security-group"
  description = "Public access to Application Load Balancer"
  vpc_id      = var.vpc_id

  ingress {
    description = "HTTP from Internet"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(var.tags, {
    Name = "sg-alb"
    Role = "edge"
  })
}

#################################
# SECURITY GROUP - CORE (MICROSERVICES)
#################################
resource "aws_security_group" "core" {
  name        = "core-security-group"
  description = "Core microservices security group"
  vpc_id      = var.vpc_id

  # Traffic from ALB to API Gateway / Core services
  ingress {
    description     = "Traffic from ALB"
    from_port       = 8080
    to_port         = 8080
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  # Internal communication between microservices
  ingress {
    description = "Internal microservice communication"
    from_port   = 3000
    to_port     = 3999
    protocol    = "tcp"
    self        = true
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(var.tags, {
    Name = "sg-core"
    Role = "core"
  })
}

#################################
# SECURITY GROUP - DATA (DBs & BROKERS)
#################################
resource "aws_security_group" "data" {
  name        = "data-security-group"
  description = "Databases and messaging layer"
  vpc_id      = var.vpc_id

  # PostgreSQL
  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.core.id]
  }

  # MongoDB
  ingress {
    from_port       = 27017
    to_port         = 27017
    protocol        = "tcp"
    security_groups = [aws_security_group.core.id]
  }

  # Redis
  ingress {
    from_port       = 6379
    to_port         = 6379
    protocol        = "tcp"
    security_groups = [aws_security_group.core.id]
  }

  # Kafka (internal broker)
  ingress {
    from_port       = 9093
    to_port         = 9093
    protocol        = "tcp"
    security_groups = [aws_security_group.core.id]
  }

  # RabbitMQ
  ingress {
    from_port       = 5672
    to_port         = 5672
    protocol        = "tcp"
    security_groups = [aws_security_group.core.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(var.tags, {
    Name = "sg-data"
    Role = "data"
  })
}
