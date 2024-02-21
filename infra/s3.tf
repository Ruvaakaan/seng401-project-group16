# s3 bucket
resource "aws_s3_bucket" "doodals-bucket-seng401" {
  bucket = "doodals-bucket-seng401"
}

# s3 bucket policy
resource "aws_s3_bucket_policy" "doodals-bucket-seng401_policy" {
  bucket = aws_s3_bucket.doodals-bucket-seng401.id

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::${aws_s3_bucket.doodals-bucket-seng401.id}/*"
    }
  ]
}
EOF
}