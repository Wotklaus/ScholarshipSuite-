provider "aws" {
  region = "us-east-1"
}

# VPC Base
module "vpc" {
  source = "../modules/vpc"
}

module "subnet_a" {
  source            = "../modules/subnet"
  vpc_id            = module.vpc.vpc_id
  availability_zone = "us-east-1a"
  cidr_block        = "10.0.1.0/24"
}

module "subnet_b" {
  source            = "../modules/subnet"
  vpc_id            = module.vpc.vpc_id
  availability_zone = "us-east-1b"
  cidr_block        = "10.0.2.0/24"
}

# Internet Gateway (requiere vpc_id)
module "igw" {
  source  = "../modules/igw"
  vpc_id  = module.vpc.vpc_id
}

# Security Group (requiere vpc_id)
module "security_group" {
  source = "../modules/security-group"
  vpc_id = module.vpc.vpc_id
}

# S3 Bucket (independiente)
module "s3" {
  source = "../modules/s3"
}

# ALB (requiere subnet_id)
module "alb" {
  source  = "../modules/alb"
  subnets = [module.subnet_a.subnet_id, module.subnet_b.subnet_id]
}

# Target Group (requiere vpc_id)
module "target_group" {
  source = "../modules/target-group"
  vpc_id = module.vpc.vpc_id
}

# Listener Rule (requiere ARN del listener y target group, ajusta en módulo)
module "listener_rule" {
  source = "../modules/listener-rule"
  listener_arn = module.alb.listener_arn
  target_group_arn = module.target_group.target_group_arn
}

# Auto Scaling Group (ASG) (requiere subnet_id y security group, puede necesitar más)
module "asg" {
  source          = "../modules/asg"
  subnet_id       = module.subnet_a.subnet_id
  security_group  = module.security_group.sg_id
}

# Launch Template (básico en demo)
module "launch_template" {
  source = "../modules/launch-template"
}

resource "aws_eip" "natgw_eip" {
 
}

module "natgw" {
  source        = "../modules/natgw"
  subnet_id     = module.subnet_a.subnet_id
  allocation_id = aws_eip.natgw_eip.id
}


# Bastion Host (requiere subnet_id y security group)
module "bastion" {
  source         = "../modules/bastion"
  subnet_id      = module.subnet_a.subnet_id
  security_group = module.security_group.sg_id
}

# RDS (independiente para prueba rápida)
module "rds" {
  source = "../modules/rds"
}

# Redis
module "redis" {
  source = "../modules/redis"
}

# API Gateway
module "api_gateway" {
  source = "../modules/api-gateway"
}


# CloudWatch
# CloudWatch
module "cloudwatch" {
  source = "../modules/cloudwatch"
}

# Backup
module "backup" {
  source = "../modules/backup"
}

# KMS
module "kms" {
  source = "../modules/kms"
}



# ECR
module "ecr" {
  source = "../modules/ecr"
}

# DocumentDB (prueba básica)
module "documentdb" {
  source = "../modules/documentdb"
}

# MODULOS DENEGADOS EN TU CUENTA AWS - SOLO COMENTA ESTOS
# module "cloudfront" {
#   source = "../modules/cloudfront"
# }

# module "ses" {
#   source = "../modules/ses"
# }

# module "eks" {
#   source = "../modules/eks"
#   # subnet_ids = [module.subnet.subnet_id]
#   # role_arn   = "arn:aws:iam::123456789012:role/eks-cluster-role"
# }

# Lambda (requiere ARN de role existente para demo)
# module "lambda" {
#  source      = "../modules/lambda"
#  # lambda_role = "arn:aws:iam::123456789012:role/lambda-role" # pon tu ARN real
# }

# module "route53" {
#   source = "../modules/route53"
#   domain = "demo.example.com"
# }