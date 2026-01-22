variable "vpc_id" {
  description = "ID de la VPC"
  type        = string
}

variable "availability_zone" {
  description = "Zona de disponibilidad"
  type        = string
}

variable "availability_zone_b" {
  description = "Second availability zone for public subnet"
  type        = string
}

variable "igw_id" {
  description = "Internet Gateway ID"
  type        = string
}

variable "nat_gateway_id" {
  description = "NAT Gateway ID"
  type        = string
}

variable "tags" {
  description = "Tags comunes"
  type        = map(string)
}





