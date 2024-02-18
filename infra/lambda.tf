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