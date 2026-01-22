resource "aws_autoscaling_group" "this" {
  name                = "${var.project}-${var.env}-asg"
  desired_capacity    = 1
  max_size            = 3
  min_size            = 1
  vpc_zone_identifier = var.private_subnets

  target_group_arns = [var.target_group_arn]

  launch_template {
    id      = var.launch_template_id
    version = "$Latest"
  }

  tag {
    key                 = "Project"
    value               = var.project
    propagate_at_launch = true
  }
}
