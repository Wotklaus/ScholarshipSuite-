resource "aws_launch_template" "this" {
  name_prefix   = "qa-api-gateway-"
  image_id      = var.ami_id
  instance_type = "t3.micro"
  key_name      = var.key_name

  vpc_security_group_ids = [var.core_sg_id]

  user_data = base64encode(var.user_data)

  tag_specifications {
    resource_type = "instance"
    tags = {
      Name        = "qa-api-gateway"
      Role        = "api-gateway"
      Environment = "qa"
      Project     = "scholarshipsuite"
    }
  }
}
