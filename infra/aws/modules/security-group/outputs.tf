output "bastion_sg_id" {
  value = aws_security_group.bastion.id
}

output "alb_sg_id" {
  value = aws_security_group.alb.id
}

output "core_sg_id" {
  value = aws_security_group.core.id
}

output "data_sg_id" {
  value = aws_security_group.data.id
}
