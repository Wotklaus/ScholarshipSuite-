resource "aws_launch_template" "main" {
  name_prefix   = "demo-launch-template"
  image_id      = "ami-0c94855ba95c71c99"  # Amazon Linux 2
  instance_type = "t2.micro"
}