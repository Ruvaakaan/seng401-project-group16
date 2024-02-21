locals {
  # functions
  create_user_funct     = "create_user"
  get_user_info_funct   = "get_user_info"
  get_drawings_funct    = "get_drawings"
  put_drawing_funct = "put_drawing"
  like_unlike_funct = "like_unlike"
  # ...

  # handlers
  create_user_handler     = "main.create_user"
  get_user_info_handler   = "main.get_user_info"
  get_drawings_handler    = "main.get_drawings"
  put_drawing_handler = "main.put_drawing"
  like_unlike_handler = "main.like_unlike"
  # ...

  # artifacts
  create_user_artifact     = "${local.create_user_funct}/artifact.zip"
  get_user_info_artifact   = "${local.get_user_info_funct}/artifact.zip"
  get_drawings_artifact    = "${local.get_drawings_funct}/artifact.zip"
  put_drawing_artifact = "${local.put_drawing_funct}/artifact.zip"
  like_unlike_artifact = "${local.like_unlike_funct}/artifact.zip"
  # ...
}