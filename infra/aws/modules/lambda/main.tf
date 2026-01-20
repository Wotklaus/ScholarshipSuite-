resource "aws_lambda_function" "main" {
  function_name = "demo-lambda"
  handler       = "index.handler"
  runtime       = "nodejs18.x"
  role          = var.lambda_role
  filename      = "lambda.zip"
}