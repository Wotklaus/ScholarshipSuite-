output "vpc_id" {
  description = "ID de la VPC QA"
  value       = module.vpc.vpc_id
}

output "public_subnet_id" {
  description = "Subnet pública"
  value       = module.subnets.public_subnet_id
}

output "private_core_subnet_id" {
  description = "Subnet privada CORE"
  value       = module.subnets.private_core_subnet_id
}

output "private_data_subnet_id" {
  description = "Subnet privada DATA"
  value       = module.subnets.private_data_subnet_id
}

output "nat_gateway_id" {
  description = "NAT Gateway"
  value       = module.natgw.nat_gateway_id
}

output "bastion_public_ip" {
  value = module.ec2_bastion.public_ip
}

output "core_private_ip" {
  value = module.ec2_core.private_ip
}

output "data_private_ip" {
  value = module.ec2_data.private_ip
}
