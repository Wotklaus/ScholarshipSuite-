variable "name" {
  description = "Name of the EC2 instance"
  type        = string
}

variable "ami_id" {
  description = "AMI ID"
  type        = string
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
}

variable "subnet_id" {
  description = "Subnet where the instance will be launched"
  type        = string
}

variable "security_group_ids" {
  description = "List of security groups"
  type        = list(string)
}

variable "key_name" {
  description = "SSH key pair name"
  type        = string
}

variable "associate_public_ip" {
  description = "Associate public IP"
  type        = bool
}

variable "tags" {
  description = "Tags"
  type        = map(string)
}
