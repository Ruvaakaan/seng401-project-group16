terraform {
  required_providers {
    aws = {
      version = ">= 4.0.0"
      source  = "hashicorp/aws"
    }
  }
}

provider "aws" {
  region = "us-west-2"
}

locals {
  # functions
  create_user_funct     = "create_user"
  get_user_info_funct   = "get_user_info"
  post_drawing_funct    = "post_drawing"
  un_like_drawing_funct = "un_like_drawing"
  # ...

  # handlers
  create_user_handler     = "main.create_user"
  get_user_info_handler   = "main.get_user_info"
  post_drawing_handler    = "main.post_drawing"
  un_like_drawing_handler = "main.un_like_drawing"
  # ...

  # artifacts
  create_user_artifact     = "${local.create_user_funct}/artifact.zip"
  get_user_info_artifact   = "${local.get_user_info_funct}/artifact.zip"
  post_drawing_artifact    = "${local.post_drawing_funct}/artifact.zip"
  un_like_drawing_artifact = "${local.un_like_drawing_funct}/artifact.zip"
  # ...
}


# s3 bucket
resource "aws_s3_bucket" "doodals-bucket-seng401" {
  bucket = "doodals-bucket-seng401"
}



# iam roles
resource "aws_iam_role" "create_user_iam" {
  name               = "iam-for-lambda-${local.create_user_funct}"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_iam_role" "get_user_info_iam" {
  name               = "iam-for-lambda-${local.get_user_info_funct}"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_iam_role" "post_drawing_iam" {
  name               = "iam-for-lambda-${local.post_drawing_funct}"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_iam_role" "un_like_drawing_iam" {
  name               = "iam-for-lambda-${local.un_like_drawing_funct}"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}
# ...



# archives
data "archive_file" "create_user_archive" {
  type = "zip"
  # this file (main.py) needs to exist in the same folder as this 
  # Terraform configuration file
  source_dir  = "../functions/create_user"
  output_path = local.create_user_artifact
}

data "archive_file" "get_user_info_archive" {
  type = "zip"
  # this file (main.py) needs to exist in the same folder as this 
  # Terraform configuration file
  source_dir  = "../functions/get_user_info"
  output_path = local.get_user_info_artifact
}

data "archive_file" "post_drawing_archive" {
  type = "zip"
  # this file (main.py) needs to exist in the same folder as this 
  # Terraform configuration file
  source_dir  = "../functions/post_drawing"
  output_path = local.post_drawing_artifact
}

data "archive_file" "un_like_drawing_archive" {
  type = "zip"
  # this file (main.py) needs to exist in the same folder as this 
  # Terraform configuration file
  source_dir  = "../functions/un_like_drawing"
  output_path = local.un_like_drawing_artifact
}
# ...



# create lambda functions
resource "aws_lambda_function" "create_user_lambda" {
  role             = aws_iam_role.create_user_iam.arn
  function_name    = local.create_user_funct
  handler          = local.create_user_handler
  filename         = local.create_user_artifact
  source_code_hash = data.archive_file.create_user_archive.output_base64sha256
  timeout          = 20

  # see all available runtimes here: https://docs.aws.amazon.com/lambda/latest/dg/API_CreateFunction.html#SSS-CreateFunction-request-Runtime
  runtime = "python3.9"
}

resource "aws_lambda_function" "get_user_info_lambda" {
  role             = aws_iam_role.get_user_info_iam.arn
  function_name    = local.get_user_info_funct
  handler          = local.get_user_info_handler
  filename         = local.get_user_info_artifact
  source_code_hash = data.archive_file.get_user_info_archive.output_base64sha256
  timeout          = 20

  # see all available runtimes here: https://docs.aws.amazon.com/lambda/latest/dg/API_CreateFunction.html#SSS-CreateFunction-request-Runtime
  runtime = "python3.9"
}

resource "aws_lambda_function" "post_drawing_lambda" {
  role             = aws_iam_role.post_drawing_iam.arn
  function_name    = local.post_drawing_funct
  handler          = local.post_drawing_handler
  filename         = local.post_drawing_artifact
  source_code_hash = data.archive_file.post_drawing_archive.output_base64sha256
  timeout          = 20

  # see all available runtimes here: https://docs.aws.amazon.com/lambda/latest/dg/API_CreateFunction.html#SSS-CreateFunction-request-Runtime
  runtime = "python3.9"
}

resource "aws_lambda_function" "un_like_drawing_lambda" {
  role             = aws_iam_role.un_like_drawing_iam.arn
  function_name    = local.un_like_drawing_funct
  handler          = local.un_like_drawing_handler
  filename         = local.un_like_drawing_artifact
  source_code_hash = data.archive_file.un_like_drawing_archive.output_base64sha256
  timeout          = 20

  # see all available runtimes here: https://docs.aws.amazon.com/lambda/latest/dg/API_CreateFunction.html#SSS-CreateFunction-request-Runtime
  runtime = "python3.9"
}
# ...



# iam policies
resource "aws_iam_policy" "create_user_policy" {
  name        = "lambda-logging-${local.create_user_funct}"
  description = "IAM policy for logging from a lambda"

  policy = <<EOF
{
  "Version": "2012-10-17",
  
  "Statement": [
    {
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "ssm:GetParameters",
        "ssm:GetParameter",
        "ssm:PutParameter",
        "dynamodb:DescribeTable",
        "dynamodb:GetItem",
        "dynamodb:Query",
        "dynamodb:Scan",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
        "dynamodb:PartiQLSelect"
      ],
      "Resource": [
        "arn:aws:logs:*:*:*",
        "${aws_dynamodb_table.doodal-users.arn}"
      ],
      "Effect": "Allow"
    }
  ]
}
EOF
}

resource "aws_iam_policy" "get_user_info_policy" {
  name        = "lambda-logging-${local.get_user_info_funct}"
  description = "IAM policy for logging from a lambda"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "ssm:GetParameters",
        "ssm:GetParameter",
        "ssm:PutParameter",
        "dynamodb:DescribeTable",
        "dynamodb:GetItem",
        "dynamodb:Query",
        "dynamodb:Scan",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
        "dynamodb:PartiQLSelect"
      ],
      "Resource": [
        "arn:aws:logs:*:*:*",
        "${aws_dynamodb_table.doodal-users.arn}"
      ],
      "Effect": "Allow"
    }
  ]
}
EOF
}

resource "aws_iam_policy" "post_drawing_policy" {
  name        = "lambda-logging-${local.post_drawing_funct}"
  description = "IAM policy for logging from a lambda"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "ssm:GetParameters",
        "ssm:GetParameter",
        "ssm:PutParameter"
      ],
      "Resource": [
        "arn:aws:logs:*:*:*"
      ],
      "Effect": "Allow"
    }
  ]
}
EOF
}

resource "aws_iam_policy" "un_like_drawing_policy" {
  name        = "lambda-logging-${local.un_like_drawing_funct}"
  description = "IAM policy for logging from a lambda"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "ssm:GetParameters",
        "ssm:GetParameter",
        "ssm:PutParameter"
      ],
      "Resource": [
        "arn:aws:logs:*:*:*"
      ],
      "Effect": "Allow"
    }
  ]
}
EOF
}
# ...



# policy attachments
# see the docs: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment
resource "aws_iam_role_policy_attachment" "create_user_logs" {
  role       = aws_iam_role.create_user_iam.name
  policy_arn = aws_iam_policy.create_user_policy.arn
}

resource "aws_iam_role_policy_attachment" "get_user_info_logs" {
  role       = aws_iam_role.get_user_info_iam.name
  policy_arn = aws_iam_policy.get_user_info_policy.arn
}

resource "aws_iam_role_policy_attachment" "post_drawing_logs" {
  role       = aws_iam_role.post_drawing_iam.name
  policy_arn = aws_iam_policy.post_drawing_policy.arn
}

resource "aws_iam_role_policy_attachment" "un_like_drawing_logs" {
  role       = aws_iam_role.un_like_drawing_iam.name
  policy_arn = aws_iam_policy.un_like_drawing_policy.arn
}
# ...


# lambda function urls 
# see the docs: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_function_url
resource "aws_lambda_function_url" "create_user_url" {
  function_name      = aws_lambda_function.create_user_lambda.function_name
  authorization_type = "NONE"

  cors {
    allow_credentials = true
    allow_origins     = ["*"]
    allow_methods     = ["POST"]
    allow_headers     = ["*"]
    expose_headers    = ["keep-alive", "date"]
  }
}

resource "aws_lambda_function_url" "get_user_info_url" {
  function_name      = aws_lambda_function.get_user_info_lambda.function_name
  authorization_type = "NONE"

  cors {
    allow_credentials = true
    allow_origins     = ["*"]
    allow_methods     = ["GET"]
    allow_headers     = ["*"]
    expose_headers    = ["keep-alive", "date"]
  }
}

resource "aws_lambda_function_url" "post_drawing_url" {
  function_name      = aws_lambda_function.post_drawing_lambda.function_name
  authorization_type = "NONE"

  cors {
    allow_credentials = true
    allow_origins     = ["*"]
    allow_methods     = ["POST"]
    allow_headers     = ["*"]
    expose_headers    = ["keep-alive", "date"]
  }
}

resource "aws_lambda_function_url" "un_like_drawing_url" {
  function_name      = aws_lambda_function.un_like_drawing_lambda.function_name
  authorization_type = "NONE"

  cors {
    allow_credentials = true
    allow_origins     = ["*"]
    allow_methods     = ["POST"]
    allow_headers     = ["*"]
    expose_headers    = ["keep-alive", "date"]
  }
}
# ...



# show the Function URL after creation
output "lambda_url" {
  value = [
    aws_lambda_function_url.create_user_url.function_url,
    aws_lambda_function_url.get_user_info_url.function_url,
    aws_lambda_function_url.post_drawing_url.function_url,
    aws_lambda_function_url.un_like_drawing_url.function_url,
    # ...
  ]
}

# dynamodb tables
resource "aws_dynamodb_table" "doodal-users" {
  name         = "doodal-users"
  billing_mode = "PROVISIONED"
  hash_key     = "UserID"

  read_capacity  = 1
  write_capacity = 1

  attribute {
    name = "UserID"
    type = "S"
  }
}

resource "aws_dynamodb_table" "doodal-drawings" {
  name         = "doodal-drawings"
  billing_mode = "PROVISIONED"
  hash_key     = "DrawingID"

  read_capacity  = 1
  write_capacity = 1

  attribute {
    name = "DrawingID"
    type = "S"
  }
}
# ...



resource "aws_apigatewayv2_api" "create_user_api" {
  name          = "create_user_api"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_integration" "create_user_integration" {
  api_id                 = aws_apigatewayv2_api.create_user_api.id
  integration_type       = "AWS_PROXY"
  integration_method     = "POST"
  integration_uri        = aws_lambda_function.create_user_lambda.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "lambda_route" {
  api_id    = aws_apigatewayv2_api.create_user_api.id
  route_key = "POST /create_user"

  target = "integrations/${aws_apigatewayv2_integration.create_user_integration.id}"
}

resource "aws_cloudwatch_log_group" "create_user_api_gateway_logs" {
  name              = "/aws/apigateway/${aws_apigatewayv2_api.create_user_api.name}"
  retention_in_days = 1  
}

resource "aws_apigatewayv2_stage" "dev_create_user_stage" {
  api_id      = aws_apigatewayv2_api.create_user_api.id
  name        = "dev_create_user_stage"
  auto_deploy = true

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.create_user_api_gateway_logs.arn

    format = jsonencode({
      requestId               = "$context.requestId"
      sourceIp                = "$context.identity.sourceIp"
      requestTime             = "$context.requestTime"
      protocol                = "$context.protocol"
      httpMethod              = "$context.httpMethod"
      resourcePath            = "$context.resourcePath"
      routeKey                = "$context.routeKey"
      status                  = "$context.status"
      responseLength          = "$context.responseLength"
      integrationErrorMessage = "$context.integrationErrorMessage"
    })
  }
}

output "api_gateway_urls" {
  value = [
    aws_apigatewayv2_stage.dev_create_user_stage.invoke_url
  ]
}
