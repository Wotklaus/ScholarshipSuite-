resource "aws_eks_cluster" "main" {
  name     = "demo-eks-cluster"
  role_arn = "arn:aws:iam::123456789012:role/eks-cluster-role" # Cambia el role!
  vpc_config {
    subnet_ids = ["subnet-xxxxxxx"] # Cambia aquí!
  }
}