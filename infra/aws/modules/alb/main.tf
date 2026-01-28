resource "aws_lb" "this" {
  name               = "${var.project}-${var.env}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [var.alb_sg_id]
  subnets            = var.public_subnets

  tags = var.tags
}

resource "aws_lb_target_group" "this" {
  name     = "${var.project}-${var.env}-tg"
  port     = 8080
  protocol = "HTTP"
  vpc_id  = var.vpc_id

  health_check {
    path = "/health"
    matcher = "200"
  }

  tags = var.tags
}

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.this.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.this.arn
  }
}
