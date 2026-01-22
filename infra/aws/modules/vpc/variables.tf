variable "name" {
  description = "Nombre de la VPC"
  type        = string
}

variable "cidr_block" {
  description = "CIDR de la VPC"
  type        = string
}

variable "tags" {
  description = "Tags comunes"
  type        = map(string)
}
