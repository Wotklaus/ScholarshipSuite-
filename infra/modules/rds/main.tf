resource "aws_db_instance" "main" {
  allocated_storage    = 20
  engine               = "mysql"
  instance_class       = "db.t3.micro"
  db_name              = "testdb"
  username             = "adminuser"
  password             = "SuperSecret123"
  skip_final_snapshot  = true
}