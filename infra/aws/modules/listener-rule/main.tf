resource "aws_lb_listener_rule" "main" {
  listener_arn = var.listener_arn

  action {
    type             = "forward"
    target_group_arn = var.target_group_arn
  }
  condition {
    path_pattern {
      values = ["/demo"]
    }
  }
}