locals {
  # functions
  create_user_funct     = "create_user"
  get_user_info_funct   = "get_user_info"
  post_drawing_funct    = "post_drawing"
  un_like_drawing_funct = "un_like_drawing"
  # ...

  # handlers
  create_user_handler     = "main.create_user"
  get_user_info_handler   = "main.get_user_info"
  post_drawing_handler    = "main.post_drawing"
  un_like_drawing_handler = "main.un_like_drawing"
  # ...

  # artifacts
  create_user_artifact     = "${local.create_user_funct}/artifact.zip"
  get_user_info_artifact   = "${local.get_user_info_funct}/artifact.zip"
  post_drawing_artifact    = "${local.post_drawing_funct}/artifact.zip"
  un_like_drawing_artifact = "${local.un_like_drawing_funct}/artifact.zip"
  # ...
}