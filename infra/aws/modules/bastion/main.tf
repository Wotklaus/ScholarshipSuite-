resource "aws_instance" "bastion" {
  ami           = "ami-0c94855ba95c71c99"
  instance_type = "t3.micro"
  subnet_id     = var.subnet_id
  vpc_security_group_ids = [var.security_group]
  key_name      = "parkeyec2"
}