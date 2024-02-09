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
  get_drawings_funct    = "get_drawings"
  get_user_info_funct   = "get_user_info"
  post_drawing_funct    = "post_drawing"
  un_like_drawing_funct = "un_like_drawing"
  # ...

  # handlers
  get_drawings_handler    = "main.get_drawings"
  get_user_info_handler   = "main.get_user_info"
  post_drawing_handler    = "main.post_drawing"
  un_like_drawing_handler = "main.un_like_drawing"
  # ...

  # artifacts
  get_drawings_artifact    = "${local.get_drawings_funct}/artifact.zip"
  get_user_info_artifact   = "${local.get_user_info_funct}/artifact.zip"
  post_drawing_artifact    = "${local.post_drawing_funct}/artifact.zip"
  un_like_drawing_artifact = "${local.un_like_drawing_funct}/artifact.zip"
  # ...
}


# s3 bucket
resource "aws_s3_bucket" "doodal-bucket-seng401" {
  bucket = "doodal-bucket-seng401"
}



# iam roles
resource "aws_iam_role" "get_drawings_iam" {
  name               = "iam-for-lambda-${local.get_drawings_funct}"
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
data "archive_file" "get_drawings_archive" {
  type = "zip"
  # this file (main.py) needs to exist in the same folder as this 
  # Terraform configuration file
  source_dir  = "../functions/get_drawings"
  output_path = local.get_drawings_artifact
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
resource "aws_lambda_function" "get_drawings_lambda" {
  role             = aws_iam_role.get_drawings_iam.arn
  function_name    = local.get_drawings_funct
  handler          = local.get_drawings_handler
  filename         = local.get_drawings_artifact
  source_code_hash = data.archive_file.get_drawings_archive.output_base64sha256
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
resource "aws_iam_policy" "get_drawings_policy" {
  name        = "lambda-logging-${local.get_drawings_funct}"
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
resource "aws_iam_role_policy_attachment" "get_drawings_logs" {
  role       = aws_iam_role.get_drawings_iam.name
  policy_arn = aws_iam_policy.get_drawings_policy.arn
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
resource "aws_lambda_function_url" "get_drawings_url" {
  function_name      = aws_lambda_function.get_drawings_lambda.function_name
  authorization_type = "NONE"

  cors {
    allow_credentials = true
    allow_origins     = ["*"]
    allow_methods     = ["GET"]
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
    aws_lambda_function_url.get_drawings_url.function_url,
    aws_lambda_function_url.get_user_info_url.function_url,
    aws_lambda_function_url.post_drawing_url.function_url,
    aws_lambda_function_url.un_like_drawing_url.function_url,
    # ...
  ]
}



# resource "aws_db_instance" "rds_mysql_db_instance" {
#   identifier                  = "rds_mysql_db"
#   storage_type                = "gp2"
#   allocated_storage           = 20
#   engine                      = "mysql"
#   engine_version              = "8.0.35"
#   instance_class              = "db.t2.micro"
#   username                    = "admin-mysql"
#   password                    = ""
#   skip_final_snapshot         = true
#   publicly_accessible         = true
#   storage_encrypted           = false
#   apply_immediately           = true
# }
