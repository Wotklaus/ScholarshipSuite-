module "vpc" {
  source = "../modules/vpc"

  name       = "${var.project_name}-${var.environment}-vpc"
  cidr_block = "10.0.0.0/16"

  tags = var.tags
}

module "igw" {
  source = "../modules/igw"

  vpc_id = module.vpc.vpc_id
  tags   = var.tags
}

module "subnets" {
  source = "../modules/subnet"

  vpc_id              = module.vpc.vpc_id
  availability_zone   = "us-east-1a"
  availability_zone_b = "us-east-1b"

  igw_id         = module.igw.igw_id
  nat_gateway_id = module.natgw.nat_gateway_id

  tags = var.tags
}

module "natgw" {
  source = "../modules/natgw"

  public_subnet_id = module.subnets.public_subnet_id
  tags             = var.tags
}

module "security_groups" {
  source = "../modules/security-group"

  vpc_id           = module.vpc.vpc_id
  allowed_ssh_cidr = "186.42.123.77/32"

  tags = var.tags
}

resource "aws_key_pair" "bastion" {
  key_name   = "prod-bastion-key"
  public_key = file("C:/Users/niklaus/.ssh/prod-bastion.pub")
}

data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
  }
}

module "ec2_bastion" {
  source = "../modules/ec2"

  name                = "prod-bastion"
  ami_id              = data.aws_ami.amazon_linux.id
  instance_type       = "t3.micro"
  subnet_id           = module.subnets.public_subnet_id
  security_group_ids  = [module.security_groups.bastion_sg_id]
  key_name            = aws_key_pair.bastion.key_name
  associate_public_ip = true

  tags = {
    Name        = "prod-bastion"
    Project     = var.project_name
    Environment = "prod"
    Role        = "bastion"
  }
}

module "alb" {
  source = "../modules/alb"

  project        = var.project_name
  env            = var.environment
  vpc_id         = module.vpc.vpc_id
  alb_sg_id      = module.security_groups.alb_sg_id
  public_subnets = module.subnets.public_subnets

  tags = var.tags
}

module "launch_template" {
  source        = "../modules/launch-template"

  project       = var.project_name
  env           = var.environment
  ami_id        = data.aws_ami.amazon_linux.id
  instance_type = "t3.micro"
  key_name      = aws_key_pair.bastion.key_name
  core_sg_id    = module.security_groups.core_sg_id
  user_data     = file("user-data-core.sh")

  tags = var.tags
}

module "asg" {
  source = "../modules/asg"

  project            = var.project_name
  env                = var.environment
  private_subnets    = [module.subnets.private_core_subnet_id]
  launch_template_id = module.launch_template.launch_template_id
  target_group_arn   = module.alb.target_group_arn
}


