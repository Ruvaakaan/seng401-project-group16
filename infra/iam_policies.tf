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


resource "aws_iam_policy" "put_drawing_policy" {
  name        = "lambda-logging-${local.put_drawing_funct}"
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
        "s3:PutObject"
      ],
      "Resource": [
        "arn:aws:logs:*:*:*",
        "arn:aws:s3:::doodals-bucket-seng401/*"
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

resource "aws_iam_role_policy_attachment" "put_drawing_logs" {
  role       = aws_iam_role.put_drawing_iam.name
  policy_arn = aws_iam_policy.put_drawing_policy.arn
}

resource "aws_iam_role_policy_attachment" "like_unlike_logs" {
  role       = aws_iam_role.like_unlike_iam.name
  policy_arn = aws_iam_policy.like_unlike_policy.arn
}
# ...