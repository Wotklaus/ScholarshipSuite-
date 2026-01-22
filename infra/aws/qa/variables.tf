variable "region" {
  description = "Región AWS"
  type        = string
}

variable "project_name" {
  description = "Scholarshipsuite"
  type        = string
}

variable "environment" {
  description = "Entorno"
  type        = string
}


variable "tags" {
  description = "Common tags for all resources"
  type        = map(string)
  default = {
    Project     = "scholarshipsuite"
    Environment = "qa"
    ManagedBy  = "Terraform"
  }
}
