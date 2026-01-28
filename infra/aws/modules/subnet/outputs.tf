output "public_subnet_id" {
  value = aws_subnet.public.id
}

output "public_subnets" {
  description = "Public subnets for ALB"
  value = [
    aws_subnet.public.id,
    aws_subnet.public_b.id
  ]
}

output "private_core_subnet_id" {
  value = aws_subnet.private_core.id
}

output "private_data_subnet_id" {
  value = aws_subnet.private_data.id
}
