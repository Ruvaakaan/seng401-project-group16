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

resource "aws_iam_policy" "update_prompts_policy" {
  name        = "lambda-logging-${local.update_prompts_funct}"
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
        "dynamodb:PartiQLSelect",
        "dynamodb:PartiQLDelete"
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
        "dynamodb:PartiQLSelect",
        "dynamodb:Scan"
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
        "dynamodb:PartiQLSelect",
        "s3:DeleteObject"
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

resource "aws_iam_policy" "get_users_drawings_policy" {
  name        = "lambda-logging-${local.get_users_drawings_funct}"
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
        "${aws_dynamodb_table.doodal-drawings.arn}",
        "${aws_dynamodb_table.doodal-likes.arn}"
      ],
      "Effect": "Allow"
    }
  ]
}
EOF
}

resource "aws_iam_policy" "upload_profile_photo_policy" {
  name        = "lambda-logging-${local.upload_profile_photo_funct}"
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
        "dynamodb:PartiQLSelect",
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": [
        "arn:aws:logs:*:*:*",
        "${aws_dynamodb_table.doodal-users.arn}",
        "arn:aws:s3:::doodals-bucket-seng401/*"
      ],
      "Effect": "Allow"
    }
  ]
}
EOF
}

resource "aws_iam_policy" "get_profile_photo_policy" {
  name        = "lambda-logging-${local.get_profile_photo_funct}"
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
        "dynamodb:PartiQLSelect",
        "s3:GetObject"
      ],
      "Resource": [
        "arn:aws:logs:*:*:*",
        "${aws_dynamodb_table.doodal-users.arn}",
        "arn:aws:s3:::doodals-bucket-seng401/*"
      ],
      "Effect": "Allow"
    }
  ]
}
EOF
}

resource "aws_iam_policy" "get_comments_policy" {
  name        = "lambda-logging-${local.get_comments_funct}"
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
        "${aws_dynamodb_table.doodal-comments.arn}"
      ],
      "Effect": "Allow"
    }
  ]
}
EOF
}

resource "aws_iam_policy" "delete_drawing_policy" {
  name        = "lambda-logging-${local.delete_drawing_funct}"
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
        "dynamodb:GetItem",
        "dynamodb:Query",
        "dynamodb:Scan",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
        "dynamodb:PartiQLSelect",
        "s3:DeleteObject"
      ],
      "Resource": [
        "arn:aws:logs:*:*:*",
        "${aws_dynamodb_table.doodal-comments.arn}",
        "${aws_dynamodb_table.doodal-likes.arn}",
        "${aws_dynamodb_table.doodal-drawings.arn}",
        "arn:aws:s3:::doodals-bucket-seng401/*"
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

resource "aws_iam_role_policy_attachment" "update_prompts_logs" {
  role       = aws_iam_role.update_prompts_iam.name
  policy_arn = aws_iam_policy.update_prompts_policy.arn
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

resource "aws_iam_role_policy_attachment" "get_users_drawings_logs" {
  role       = aws_iam_role.get_users_drawings_iam.name
  policy_arn = aws_iam_policy.get_users_drawings_policy.arn
}

resource "aws_iam_role_policy_attachment" "upload_profile_photo_logs" {
  role       = aws_iam_role.upload_profile_photo_iam.name
  policy_arn = aws_iam_policy.upload_profile_photo_policy.arn
}

resource "aws_iam_role_policy_attachment" "get_profile_photo_logs" {
  role       = aws_iam_role.get_profile_photo_iam.name
  policy_arn = aws_iam_policy.get_profile_photo_policy.arn
}

resource "aws_iam_role_policy_attachment" "get_comments_logs" {
  role       = aws_iam_role.get_comments_iam.name
  policy_arn = aws_iam_policy.get_comments_policy.arn
}

resource "aws_iam_role_policy_attachment" "delete_drawing_logs" {
  role       = aws_iam_role.delete_drawing_iam.name
  policy_arn = aws_iam_policy.delete_drawing_policy.arn
}
# ...