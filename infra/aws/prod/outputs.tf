output "prod_alb_dns" {
  value = module.alb.alb_dns
}

output "prod_elastic_ip" {
  value = module.natgw.elastic_ip
}
