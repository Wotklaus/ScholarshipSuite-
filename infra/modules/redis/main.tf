resource "aws_elasticache_cluster" "main" {
  cluster_id           = "demo-redis-cluster"
  engine               = "redis"
  node_type            = "cache.t2.micro"
  num_cache_nodes      = 1
}