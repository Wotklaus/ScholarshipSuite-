variable "project" {}
variable "env" {}
variable "private_subnets" { type = list(string) }
variable "launch_template_id" {}
variable "target_group_arn" {}
