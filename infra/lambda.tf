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

data "archive_file" "update_prompts_archive" {
  type = "zip"
  # this file (main.py) needs to exist in the same folder as this 
  # Terraform configuration file
  source_dir  = "../functions/update_prompts"
  output_path = local.update_prompts_artifact
}

data "archive_file" "upload_drawing_archive" {
  type = "zip"
  # this file (main.py) needs to exist in the same folder as this 
  # Terraform configuration file
  source_dir  = "../functions/upload_drawing"
  output_path = local.upload_drawing_artifact
}

data "archive_file" "like_unlike_archive" {
  type = "zip"
  # this file (main.py) needs to exist in the same folder as this 
  # Terraform configuration file
  source_dir  = "../functions/like_unlike"
  output_path = local.like_unlike_artifact
}

data "archive_file" "create_prompt_archive" {
  type = "zip"
  # this file (main.py) needs to exist in the same folder as this 
  # Terraform configuration file
  source_dir  = "../functions/create_prompt"
  output_path = local.create_prompt_artifact
}

data "archive_file" "add_comment_archive" {
  type = "zip"
  # this file (main.py) needs to exist in the same folder as this 
  # Terraform configuration file
  source_dir  = "../functions/add_comment"
  output_path = local.add_comment_artifact
}

data "archive_file" "delete_comment_archive" {
  type = "zip"
  # this file (main.py) needs to exist in the same folder as this 
  # Terraform configuration file
  source_dir  = "../functions/delete_comment"
  output_path = local.delete_comment_artifact
}

data "archive_file" "update_bio_archive" {
  type = "zip"
  # this file (main.py) needs to exist in the same folder as this 
  # Terraform configuration file
  source_dir  = "../functions/update_bio"
  output_path = local.update_bio_artifact
}

data "archive_file" "get_prompts_archive" {
  type = "zip"
  # this file (main.py) needs to exist in the same folder as this 
  # Terraform configuration file
  source_dir  = "../functions/get_prompts"
  output_path = local.get_prompts_artifact
}

data "archive_file" "get_users_drawings_archive" {
  type = "zip"
  # this file (main.py) needs to exist in the same folder as this 
  # Terraform configuration file
  source_dir  = "../functions/get_users_drawings"
  output_path = local.get_users_drawings_artifact
}

data "archive_file" "upload_profile_photo_archive" {
  type = "zip"
  # this file (main.py) needs to exist in the same folder as this 
  # Terraform configuration file
  source_dir  = "../functions/upload_profile_photo"
  output_path = local.upload_profile_photo_artifact
}

data "archive_file" "get_profile_photo_archive" {
  type = "zip"
  # this file (main.py) needs to exist in the same folder as this 
  # Terraform configuration file
  source_dir  = "../functions/get_profile_photo"
  output_path = local.get_profile_photo_artifact
}

data "archive_file" "get_comments_archive" {
  type = "zip"
  # this file (main.py) needs to exist in the same folder as this 
  # Terraform configuration file
  source_dir  = "../functions/get_comments"
  output_path = local.get_comments_artifact
}

data "archive_file" "delete_drawing_archive" {
  type = "zip"
  # this file (main.py) needs to exist in the same folder as this 
  # Terraform configuration file
  source_dir  = "../functions/delete_drawing"
  output_path = local.delete_drawing_artifact
}

data "archive_file" "get_user_info_by_username_archive" {
  type = "zip"
  # this file (main.py) needs to exist in the same folder as this 
  # Terraform configuration file
  source_dir  = "../functions/get_user_info_by_username"
  output_path = local.get_user_info_by_username_artifact
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

resource "aws_lambda_function" "update_prompts_lambda" {
  role             = aws_iam_role.update_prompts_iam.arn
  function_name    = local.update_prompts_funct
  handler          = local.update_prompts_handler
  filename         = local.update_prompts_artifact
  source_code_hash = data.archive_file.update_prompts_archive.output_base64sha256
  timeout          = 20

  # see all available runtimes here: https://docs.aws.amazon.com/lambda/latest/dg/API_CreateFunction.html#SSS-CreateFunction-request-Runtime
  runtime = "python3.9"
}

resource "aws_lambda_function" "upload_drawing_lambda" {
  role             = aws_iam_role.upload_drawing_iam.arn
  function_name    = local.upload_drawing_funct
  handler          = local.upload_drawing_handler
  filename         = local.upload_drawing_artifact
  source_code_hash = data.archive_file.upload_drawing_archive.output_base64sha256
  timeout          = 20

  # see all available runtimes here: https://docs.aws.amazon.com/lambda/latest/dg/API_CreateFunction.html#SSS-CreateFunction-request-Runtime
  runtime = "python3.9"
}

resource "aws_lambda_function" "like_unlike_lambda" {
  role             = aws_iam_role.like_unlike_iam.arn
  function_name    = local.like_unlike_funct
  handler          = local.like_unlike_handler
  filename         = local.like_unlike_artifact
  source_code_hash = data.archive_file.like_unlike_archive.output_base64sha256
  timeout          = 20

  # see all available runtimes here: https://docs.aws.amazon.com/lambda/latest/dg/API_CreateFunction.html#SSS-CreateFunction-request-Runtime
  runtime = "python3.9"
}

resource "aws_lambda_function" "create_prompt_lambda" {
  role             = aws_iam_role.create_prompt_iam.arn
  function_name    = local.create_prompt_funct
  handler          = local.create_prompt_handler
  filename         = local.create_prompt_artifact
  source_code_hash = data.archive_file.create_prompt_archive.output_base64sha256
  timeout          = 20

  # see all available runtimes here: https://docs.aws.amazon.com/lambda/latest/dg/API_CreateFunction.html#SSS-CreateFunction-request-Runtime
  runtime = "python3.9"
}

resource "aws_lambda_function" "add_comment_lambda" {
  role             = aws_iam_role.add_comment_iam.arn
  function_name    = local.add_comment_funct
  handler          = local.add_comment_handler
  filename         = local.add_comment_artifact
  source_code_hash = data.archive_file.add_comment_archive.output_base64sha256
  timeout          = 20

  # see all available runtimes here: https://docs.aws.amazon.com/lambda/latest/dg/API_CreateFunction.html#SSS-CreateFunction-request-Runtime
  runtime = "python3.9"
}

resource "aws_lambda_function" "delete_comment_lambda" {
  role             = aws_iam_role.delete_comment_iam.arn
  function_name    = local.delete_comment_funct
  handler          = local.delete_comment_handler
  filename         = local.delete_comment_artifact
  source_code_hash = data.archive_file.delete_comment_archive.output_base64sha256
  timeout          = 20

  # see all available runtimes here: https://docs.aws.amazon.com/lambda/latest/dg/API_CreateFunction.html#SSS-CreateFunction-request-Runtime
  runtime = "python3.9"
}

resource "aws_lambda_function" "update_bio_lambda" {
  role             = aws_iam_role.update_bio_iam.arn
  function_name    = local.update_bio_funct
  handler          = local.update_bio_handler
  filename         = local.update_bio_artifact
  source_code_hash = data.archive_file.update_bio_archive.output_base64sha256
  timeout          = 20

  # see all available runtimes here: https://docs.aws.amazon.com/lambda/latest/dg/API_CreateFunction.html#SSS-CreateFunction-request-Runtime
  runtime = "python3.9"
}

resource "aws_lambda_function" "get_prompts_lambda" {
  role             = aws_iam_role.get_prompts_iam.arn
  function_name    = local.get_prompts_funct
  handler          = local.get_prompts_handler
  filename         = local.get_prompts_artifact
  source_code_hash = data.archive_file.get_prompts_archive.output_base64sha256
  timeout          = 20

  # see all available runtimes here: https://docs.aws.amazon.com/lambda/latest/dg/API_CreateFunction.html#SSS-CreateFunction-request-Runtime
  runtime = "python3.9"
}

resource "aws_lambda_function" "get_users_drawings_lambda" {
  role             = aws_iam_role.get_users_drawings_iam.arn
  function_name    = local.get_users_drawings_funct
  handler          = local.get_users_drawings_handler
  filename         = local.get_users_drawings_artifact
  source_code_hash = data.archive_file.get_users_drawings_archive.output_base64sha256
  timeout          = 20

  # see all available runtimes here: https://docs.aws.amazon.com/lambda/latest/dg/API_CreateFunction.html#SSS-CreateFunction-request-Runtime
  runtime = "python3.9"
}

resource "aws_lambda_function" "upload_profile_photo_lambda" {
  role             = aws_iam_role.upload_profile_photo_iam.arn
  function_name    = local.upload_profile_photo_funct
  handler          = local.upload_profile_photo_handler
  filename         = local.upload_profile_photo_artifact
  source_code_hash = data.archive_file.upload_profile_photo_archive.output_base64sha256
  timeout          = 20

  # see all available runtimes here: https://docs.aws.amazon.com/lambda/latest/dg/API_CreateFunction.html#SSS-CreateFunction-request-Runtime
  runtime = "python3.9"
}

resource "aws_lambda_function" "get_profile_photo_lambda" {
  role             = aws_iam_role.get_profile_photo_iam.arn
  function_name    = local.get_profile_photo_funct
  handler          = local.get_profile_photo_handler
  filename         = local.get_profile_photo_artifact
  source_code_hash = data.archive_file.get_profile_photo_archive.output_base64sha256
  timeout          = 20

  # see all available runtimes here: https://docs.aws.amazon.com/lambda/latest/dg/API_CreateFunction.html#SSS-CreateFunction-request-Runtime
  runtime = "python3.9"
}

resource "aws_lambda_function" "get_comments_lambda" {
  role             = aws_iam_role.get_comments_iam.arn
  function_name    = local.get_comments_funct
  handler          = local.get_comments_handler
  filename         = local.get_comments_artifact
  source_code_hash = data.archive_file.get_comments_archive.output_base64sha256
  timeout          = 20

  # see all available runtimes here: https://docs.aws.amazon.com/lambda/latest/dg/API_CreateFunction.html#SSS-CreateFunction-request-Runtime
  runtime = "python3.9"
}

resource "aws_lambda_function" "delete_drawing_lambda" {
  role             = aws_iam_role.delete_drawing_iam.arn
  function_name    = local.delete_drawing_funct
  handler          = local.delete_drawing_handler
  filename         = local.delete_drawing_artifact
  source_code_hash = data.archive_file.delete_drawing_archive.output_base64sha256
  timeout          = 20

  # see all available runtimes here: https://docs.aws.amazon.com/lambda/latest/dg/API_CreateFunction.html#SSS-CreateFunction-request-Runtime
  runtime = "python3.9"
}

resource "aws_lambda_function" "get_user_info_by_username_lambda" {
  role             = aws_iam_role.get_user_info_by_username_iam.arn
  function_name    = local.get_user_info_by_username_funct
  handler          = local.get_user_info_by_username_handler
  filename         = local.get_user_info_by_username_artifact
  source_code_hash = data.archive_file.get_user_info_by_username_archive.output_base64sha256
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

resource "aws_lambda_function_url" "update_prompts_url" {
  function_name      = aws_lambda_function.update_prompts_lambda.function_name
  authorization_type = "NONE"

  cors {
    allow_credentials = true
    allow_origins     = ["*"]
    allow_methods     = ["POST"]
    allow_headers     = ["*"]
    expose_headers    = ["keep-alive", "date"]
  }
}

resource "aws_lambda_function_url" "upload_drawing_url" {
  function_name      = aws_lambda_function.upload_drawing_lambda.function_name
  authorization_type = "NONE"

  cors {
    allow_credentials = true
    allow_origins     = ["*"]
    allow_methods     = ["POST"]
    allow_headers     = ["*"]
    expose_headers    = ["keep-alive", "date"]
  }
}

resource "aws_lambda_function_url" "like_unlike_url" {
  function_name      = aws_lambda_function.like_unlike_lambda.function_name
  authorization_type = "NONE"

  cors {
    allow_credentials = true
    allow_origins     = ["*"]
    allow_methods     = ["POST"]
    allow_headers     = ["*"]
    expose_headers    = ["keep-alive", "date"]
  }
}

resource "aws_lambda_function_url" "create_prompt_url" {
  function_name      = aws_lambda_function.create_prompt_lambda.function_name
  authorization_type = "NONE"

  cors {
    allow_credentials = true
    allow_origins     = ["*"]
    allow_methods     = ["POST"]
    allow_headers     = ["*"]
    expose_headers    = ["keep-alive", "date"]
  }
}

resource "aws_lambda_function_url" "add_comment_url" {
  function_name      = aws_lambda_function.add_comment_lambda.function_name
  authorization_type = "NONE"

  cors {
    allow_credentials = true
    allow_origins     = ["*"]
    allow_methods     = ["POST"]
    allow_headers     = ["*"]
    expose_headers    = ["keep-alive", "date"]
  }
}

resource "aws_lambda_function_url" "delete_comment_url" {
  function_name      = aws_lambda_function.delete_comment_lambda.function_name
  authorization_type = "NONE"

  cors {
    allow_credentials = true
    allow_origins     = ["*"]
    allow_methods     = ["POST"]
    allow_headers     = ["*"]
    expose_headers    = ["keep-alive", "date"]
  }
}

resource "aws_lambda_function_url" "update_bio_url" {
  function_name      = aws_lambda_function.update_bio_lambda.function_name
  authorization_type = "NONE"

  cors {
    allow_credentials = true
    allow_origins     = ["*"]
    allow_methods     = ["POST"]
    allow_headers     = ["*"]
    expose_headers    = ["keep-alive", "date"]
  }
}

resource "aws_lambda_function_url" "get_prompts_url" {
  function_name      = aws_lambda_function.get_prompts_lambda.function_name
  authorization_type = "NONE"

  cors {
    allow_credentials = true
    allow_origins     = ["*"]
    allow_methods     = ["POST"]
    allow_headers     = ["*"]
    expose_headers    = ["keep-alive", "date"]
  }
}

resource "aws_lambda_function_url" "get_users_drawings_url" {
  function_name      = aws_lambda_function.get_users_drawings_lambda.function_name
  authorization_type = "NONE"

  cors {
    allow_credentials = true
    allow_origins     = ["*"]
    allow_methods     = ["POST"]
    allow_headers     = ["*"]
    expose_headers    = ["keep-alive", "date"]
  }
}

resource "aws_lambda_function_url" "upload_profile_photo_url" {
  function_name      = aws_lambda_function.upload_profile_photo_lambda.function_name
  authorization_type = "NONE"

  cors {
    allow_credentials = true
    allow_origins     = ["*"]
    allow_methods     = ["POST"]
    allow_headers     = ["*"]
    expose_headers    = ["keep-alive", "date"]
  }
}

resource "aws_lambda_function_url" "get_profile_photo_url" {
  function_name      = aws_lambda_function.get_profile_photo_lambda.function_name
  authorization_type = "NONE"

  cors {
    allow_credentials = true
    allow_origins     = ["*"]
    allow_methods     = ["GET"]
    allow_headers     = ["*"]
    expose_headers    = ["keep-alive", "date"]
  }
}

resource "aws_lambda_function_url" "get_comments_url" {
  function_name      = aws_lambda_function.get_comments_lambda.function_name
  authorization_type = "NONE"

  cors {
    allow_credentials = true
    allow_origins     = ["*"]
    allow_methods     = ["GET"]
    allow_headers     = ["*"]
    expose_headers    = ["keep-alive", "date"]
  }
}

resource "aws_lambda_function_url" "delete_drawing_url" {
  function_name      = aws_lambda_function.delete_drawing_lambda.function_name
  authorization_type = "NONE"

  cors {
    allow_credentials = true
    allow_origins     = ["*"]
    allow_methods     = ["POST"]
    allow_headers     = ["*"]
    expose_headers    = ["keep-alive", "date"]
  }
}

resource "aws_lambda_function_url" "get_user_info_by_username_url" {
  function_name      = aws_lambda_function.get_user_info_by_username_lambda.function_name
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