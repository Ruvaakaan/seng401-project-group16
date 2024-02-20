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

resource "aws_dynamodb_table" "doodal-likes" {
  name         = "doodal-likes"
  billing_mode = "PROVISIONED"
  hash_key     = "UserID"

  read_capacity  = 1
  write_capacity = 1

  attribute {
    name = "UserID"
    type = "S"
  }
}

resource "aws_dynamodb_table" "doodal-comments" {
  name         = "doodal-comments"
  billing_mode = "PROVISIONED"
  hash_key     = "UserID"

  read_capacity  = 1
  write_capacity = 1

  attribute {
    name = "UserID"
    type = "S"
  }
}
# ...