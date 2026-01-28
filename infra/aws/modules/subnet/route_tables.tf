# -------------------------
# PUBLIC ROUTE TABLE
# -------------------------
resource "aws_route_table" "public" {
  vpc_id = var.vpc_id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = var.igw_id
  }

  tags = merge(var.tags, {
    Name = "qa-public-rt"
  })
}

resource "aws_route_table_association" "public_assoc" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}

# -------------------------
# PRIVATE ROUTE TABLE
# -------------------------
resource "aws_route_table" "private" {
  vpc_id = var.vpc_id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = var.nat_gateway_id
  }

  tags = merge(var.tags, {
    Name = "qa-private-rt"
  })
}

resource "aws_route_table_association" "core_assoc" {
  subnet_id      = aws_subnet.private_core.id
  route_table_id = aws_route_table.private.id
}

resource "aws_route_table_association" "data_assoc" {
  subnet_id      = aws_subnet.private_data.id
  route_table_id = aws_route_table.private.id
}
