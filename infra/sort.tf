locals {
  sort_drawings_funct    = "sort-drawings"
  sort_drawings_handler  = "main.sort_drawings_handler"
  sort_drawings_artifact = "${local.sort_drawings_funct}/artifact.zip"
}

resource "aws_iam_role" "sort_drawings_iam" {
  name               = "iam-for-lambda-${local.sort_drawings_funct}"
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

data "archive_file" "sort_drawings_archive" {
  type        = "zip"
  source_dir  = "../functions/sort_drawings"
  output_path = local.sort_drawings_artifact
}

resource "aws_lambda_function" "sort_drawings_lambda" {
  role             = aws_iam_role.sort_drawings_iam.arn
  function_name    = local.sort_drawings_funct
  handler          = local.sort_drawings_handler
  filename         = local.sort_drawings_artifact
  source_code_hash = data.archive_file.sort_drawings_archive.output_base64sha256
  timeout = 20
  runtime = "python3.9"
}

resource "aws_iam_policy" "sort_drawings_policy" {
  name        = "lambda-logging-${local.sort_drawings_funct}"
  description = "IAM policy for logging from a lambda"

  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents"
            ],
            "Resource": "arn:aws:logs:*:*:*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:DescribeTable",
                "dynamodb:GetItem",
                "dynamodb:Query",
                "dynamodb:Scan",
                "dynamodb:PutItem",
                "dynamodb:UpdateItem",
                "dynamodb:DeleteItem",
                "dynamodb:PartiQLSelect",
                "dynamodb:PartiQLDelete"
            ],
            "Resource": [
                "arn:aws:logs:*:*:*",
                "${aws_dynamodb_table.doodal-drawings.arn}",
                "${aws_dynamodb_table.doodal-likes.arn}",
                "${aws_dynamodb_table.doodal-users.arn}"
            ]
        }
    ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "sort_drawings_logs" {
  role       = aws_iam_role.sort_drawings_iam.name
  policy_arn = aws_iam_policy.sort_drawings_policy.arn
}

resource "aws_lambda_function_url" "sort_drawings_url" {
  function_name      = aws_lambda_function.sort_drawings_lambda.function_name
  authorization_type = "NONE"

  cors {
    allow_credentials = true
    allow_origins     = ["*"]
    allow_methods     = ["GET"]
    allow_headers     = ["*"]
    expose_headers    = ["keep-alive", "date"]
  }
}

output "sort_drawings_output" {
  value = aws_lambda_function_url.sort_drawings_url.function_url
}