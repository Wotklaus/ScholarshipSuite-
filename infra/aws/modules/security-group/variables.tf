variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "allowed_ssh_cidr" {
  description = "CIDR permitido para SSH al bastion (TU IP)"
  type        = string
}

variable "tags" {
  description = "Tags comunes"
  type        = map(string)
}
