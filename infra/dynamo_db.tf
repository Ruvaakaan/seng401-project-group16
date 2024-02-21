# dynamodb tables
resource "aws_dynamodb_table" "doodal-users" {
  name         = "doodal-users"
  billing_mode = "PROVISIONED"
  hash_key     = "user_id"

  read_capacity  = 1
  write_capacity = 1

  attribute {
    name = "user_id"
    type = "S"
  }
}

resource "aws_dynamodb_table" "doodal-drawings" {
  name         = "doodal-drawings"
  billing_mode = "PROVISIONED"
  hash_key     = "drawing_id"

  read_capacity  = 1
  write_capacity = 1

  attribute {
    name = "drawing_id"
    type = "S"
  }
}

resource "aws_dynamodb_table" "doodal-likes" {
  name         = "doodal-likes"
  billing_mode = "PROVISIONED"
  hash_key     = "user_id"

  read_capacity  = 1
  write_capacity = 1

  attribute {
    name = "user_id"
    type = "S"
  }
}

resource "aws_dynamodb_table" "doodal-comments" {
  name         = "doodal-comments"
  billing_mode = "PROVISIONED"
  hash_key     = "user_id"

  read_capacity  = 1
  write_capacity = 1

  attribute {
    name = "user_id"
    type = "S"
  }
}
# ...