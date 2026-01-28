# Subnet pública
resource "aws_subnet" "public" {
  vpc_id                  = var.vpc_id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = var.availability_zone
  map_public_ip_on_launch = true

  tags = merge(var.tags, {
    Name = "qa-public-subnet"
    Tier = "public"
  })
}

# Subnet privada CORE
resource "aws_subnet" "private_core" {
  vpc_id            = var.vpc_id
  cidr_block        = "10.0.10.0/24"
  availability_zone = var.availability_zone

  tags = merge(var.tags, {
    Name = "qa-private-core-subnet"
    Tier = "core"
  })
}

# Subnet privada DATA
resource "aws_subnet" "private_data" {
  vpc_id            = var.vpc_id
  cidr_block        = "10.0.20.0/24"
  availability_zone = var.availability_zone

  tags = merge(var.tags, {
    Name = "qa-private-data-subnet"
    Tier = "data"
  })
}


# Segunda subnet pública (AZ distinta para ALB)
resource "aws_subnet" "public_b" {
  vpc_id                  = var.vpc_id
  cidr_block              = "10.0.2.0/24"
  availability_zone       = var.availability_zone_b
  map_public_ip_on_launch = true

  tags = merge(var.tags, {
    Name = "qa-public-subnet-b"
    Tier = "public"
  })
}

