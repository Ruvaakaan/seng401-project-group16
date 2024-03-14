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
  name           = "doodal-likes"
  billing_mode   = "PROVISIONED"
  hash_key       = "user_id"
  range_key      = "drawing_id"  

  read_capacity  = 1
  write_capacity = 1

  attribute {
    name = "user_id"
    type = "S"
  }

  attribute {
    name = "drawing_id"
    type = "S"           
  }
}

resource "aws_dynamodb_table" "doodal-comments" {
  name         = "doodal-comments"
  billing_mode = "PROVISIONED"
  hash_key     = "comment_id"

  read_capacity  = 1
  write_capacity = 1

  attribute {
    name = "comment_id"
    type = "S"
  }
}

resource "aws_dynamodb_table" "doodal-prompts" {
  name         = "doodal-prompts"
  billing_mode = "PROVISIONED"
  hash_key     = "competition_id"

  read_capacity  = 1
  write_capacity = 1

  attribute {
    name = "competition_id"
    type = "S"
  }
}
# ...