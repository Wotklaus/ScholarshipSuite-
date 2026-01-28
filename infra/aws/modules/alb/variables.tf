variable "project" {}
variable "env" {}
variable "vpc_id" {}
variable "public_subnets" { type = list(string) }
variable "alb_sg_id" {}
variable "tags" { type = map(string) }
