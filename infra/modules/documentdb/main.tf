resource "aws_docdb_cluster" "main" {
  cluster_identifier    = "nuevo-nombre-cluster"
  master_username       = "adminuser"
  master_password       = "SuperSecret123"
  skip_final_snapshot   = true
}