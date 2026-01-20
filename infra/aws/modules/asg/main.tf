resource "aws_api_gateway_rest_api" "main" {
  name = "demo-api-gateway"
}

output "api_gateway_id" {
  value = aws_api_gateway_rest_api.main.id
}

# Crear un Launch Template en lugar de Launch Configuration
resource "aws_launch_template" "main" {
  name          = "demo-launch-template"
  image_id      = "ami-0c94855ba95c71c99" # Cambia por tu imagen válida si es necesario
  instance_type = "t2.micro" # Tipo de instancia definida

  network_interfaces {
    associate_public_ip_address = true
    security_groups             = [var.security_group]
  }
  
  tag_specifications {
    resource_type = "instance"
    tags = {
      Name = "asg-instance"
    }
  }
}

# Actualizar el ASG para usar Launch Template
resource "aws_autoscaling_group" "main" {
  name                = "demo-asg"
  max_size            = 1
  min_size            = 1
  desired_capacity    = 1
  vpc_zone_identifier = [var.subnet_id]

  # Referencia al Launch Template
  launch_template {
    id      = aws_launch_template.main.id
    version = "$Latest"
  }

  tag {
    key                 = "Name"
    value               = "asg-instance"
    propagate_at_launch = true
  }
}