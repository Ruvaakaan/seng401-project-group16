# iam policies for lambdas
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

resource "aws_iam_policy" "get_drawings_policy" {
  name        = "lambda-logging-${local.get_drawings_funct}"
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
        "s3:GetObject"
      ],
      "Resource": "arn:aws:s3:::doodals-bucket-seng401/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket",
        "s3:GetBucketLocation"
      ],
      "Resource": "arn:aws:s3:::doodals-bucket-seng401"
    }
  ]
}
EOF
}


resource "aws_iam_policy" "upload_drawing_policy" {
  name        = "lambda-logging-${local.upload_drawing_funct}"
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
        "s3:PutObject",
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
        "arn:aws:s3:::doodals-bucket-seng401/*",
        "${aws_dynamodb_table.doodal-drawings.arn}"
      ],
      "Effect": "Allow"
    }
  ]
}
EOF
}

resource "aws_iam_policy" "like_unlike_policy" {
  name        = "lambda-logging-${local.like_unlike_funct}"
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
        "${aws_dynamodb_table.doodal-likes.arn}"
      ],
      "Effect": "Allow"
    }
  ]
}
EOF
}

resource "aws_iam_policy" "create_prompt_policy" {
  name        = "lambda-logging-${local.create_prompt_funct}"
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
        "dynamodb:PutItem",
        "dynamodb:PartiQLSelect"
      ],
      "Resource": [
        "arn:aws:logs:*:*:*",
        "${aws_dynamodb_table.doodal-prompts.arn}",
        "arn:aws:ssm:us-west-2:905418414303:parameter/doodal_openapi"
      ],
      "Effect": "Allow"
    }
  ]
}
EOF
}


resource "aws_iam_policy" "add_comment_policy" {
  name        = "lambda-logging-${local.add_comment_funct}"
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
        "dynamodb:PutItem"
      ],
      "Resource": [
        "arn:aws:logs:*:*:*",
        "${aws_dynamodb_table.doodal-comments.arn}"
      ],
      "Effect": "Allow"
    }
  ]
}
EOF
}

resource "aws_iam_policy" "delete_comment_policy" {
  name        = "lambda-logging-${local.delete_comment_funct}"
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
        "dynamodb:PartiQLDelete",
        "dynamodb:DeleteItem"
      ],
      "Resource": [
        "arn:aws:logs:*:*:*",
        "${aws_dynamodb_table.doodal-comments.arn}"
      ],
      "Effect": "Allow"
    }
  ]
}
EOF
}

resource "aws_iam_policy" "update_bio_policy" {
  name        = "lambda-logging-${local.update_bio_funct}"
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

resource "aws_iam_policy" "get_prompts_policy" {
  name        = "lambda-logging-${local.get_prompts_funct}"
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
        "${aws_dynamodb_table.doodal-prompts.arn}"
      ],
      "Effect": "Allow"
    }
  ]
}
EOF
}

resource "aws_iam_policy" "get_prompt_policy" {
  name        = "lambda-logging-${local.get_prompt_funct}"
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
        "${aws_dynamodb_table.doodal-prompts.arn}"
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

resource "aws_iam_role_policy_attachment" "get_drawings_logs" {
  role       = aws_iam_role.get_drawings_iam.name
  policy_arn = aws_iam_policy.get_drawings_policy.arn
}

resource "aws_iam_role_policy_attachment" "upload_drawing_logs" {
  role       = aws_iam_role.upload_drawing_iam.name
  policy_arn = aws_iam_policy.upload_drawing_policy.arn
}

resource "aws_iam_role_policy_attachment" "like_unlike_logs" {
  role       = aws_iam_role.like_unlike_iam.name
  policy_arn = aws_iam_policy.like_unlike_policy.arn
}

resource "aws_iam_role_policy_attachment" "create_prompt_logs" {
  role       = aws_iam_role.create_prompt_iam.name
  policy_arn = aws_iam_policy.create_prompt_policy.arn
}

resource "aws_iam_role_policy_attachment" "add_comment_logs" {
  role       = aws_iam_role.add_comment_iam.name
  policy_arn = aws_iam_policy.add_comment_policy.arn
}

resource "aws_iam_role_policy_attachment" "delete_comment_logs" {
  role       = aws_iam_role.delete_comment_iam.name
  policy_arn = aws_iam_policy.delete_comment_policy.arn
}

resource "aws_iam_role_policy_attachment" "update_bio_logs" {
  role       = aws_iam_role.update_bio_iam.name
  policy_arn = aws_iam_policy.update_bio_policy.arn
}

resource "aws_iam_role_policy_attachment" "get_prompts_logs" {
  role       = aws_iam_role.get_prompts_iam.name
  policy_arn = aws_iam_policy.get_prompts_policy.arn
}

resource "aws_iam_role_policy_attachment" "get_prompt_logs" {
  role       = aws_iam_role.get_prompt_iam.name
  policy_arn = aws_iam_policy.get_prompt_policy.arn
}
# ...