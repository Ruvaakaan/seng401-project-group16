locals {
  # functions
  create_user_funct     = "create_user"
  get_user_info_funct   = "get_user_info"
  update_prompts_funct    = "update_prompts"
  upload_drawing_funct = "upload_drawing"
  like_unlike_funct = "like_unlike"
  create_prompt_funct = "create_prompt"
  add_comment_funct = "add_comment"
  delete_comment_funct = "delete_comment"
  update_bio_funct = "update_bio"
  get_prompts_funct = "get_prompts"
  get_users_drawings_funct = "get_users_drawings"
  upload_profile_photo_funct = "upload_profile_photo"
  get_profile_photo_funct = "get_profile_photo"
  get_comments_funct = "get_comments"
  # ...

  # handlers
  create_user_handler     = "main.create_user"
  get_user_info_handler   = "main.get_user_info"
  update_prompts_handler    = "main.update_prompts"
  upload_drawing_handler = "main.upload_drawing"
  like_unlike_handler = "main.like_unlike"
  create_prompt_handler = "main.create_prompt"
  add_comment_handler = "main.add_comment"
  delete_comment_handler = "main.delete_comment"
  update_bio_handler = "main.update_bio"
  get_prompts_handler = "main.get_prompts"
  get_users_drawings_handler = "main.get_users_drawings"  
  upload_profile_photo_handler = "main.upload_profile_photo"  
  get_profile_photo_handler = "main.get_profile_photo"  
  get_comments_handler = "main.get_comments" 
  # ...

  # artifacts
  create_user_artifact     = "${local.create_user_funct}/artifact.zip"
  get_user_info_artifact   = "${local.get_user_info_funct}/artifact.zip"
  update_prompts_artifact    = "${local.update_prompts_funct}/artifact.zip"
  upload_drawing_artifact = "${local.upload_drawing_funct}/artifact.zip"
  like_unlike_artifact = "${local.like_unlike_funct}/artifact.zip"
  create_prompt_artifact = "${local.create_prompt_funct}/artifact.zip"
  add_comment_artifact = "${local.add_comment_funct}/artifact.zip"
  delete_comment_artifact = "${local.delete_comment_funct}/artifact.zip"
  update_bio_artifact = "${local.update_bio_funct}/artifact.zip"
  get_prompts_artifact = "${local.get_prompts_funct}/artifact.zip"
  get_users_drawings_artifact = "${local.get_users_drawings_funct}/artifact.zip"
  upload_profile_photo_artifact = "${local.upload_profile_photo_funct}/artifact.zip"
  get_profile_photo_artifact = "${local.get_profile_photo_funct}/artifact.zip"
  get_comments_artifact = "${local.get_comments_funct}/artifact.zip"
  # ...

  # lambda urls 
  lambda_urls = [
    {
      name = "create_user_url"
      url  = aws_lambda_function_url.create_user_url.function_url
    },
    {
      name = "get_user_info_url"
      url  = aws_lambda_function_url.get_user_info_url.function_url
    },
    {
      name = "update_prompts_url"
      url  = aws_lambda_function_url.update_prompts_url.function_url
    },
    {
      name = "upload_drawing_url"
      url  = aws_lambda_function_url.upload_drawing_url.function_url
    },
    {
      name = "like_unlike_url"
      url  = aws_lambda_function_url.like_unlike_url.function_url
    },
    {
      name = "create_prompt_url"
      url  = aws_lambda_function_url.create_prompt_url.function_url
    },
    {
      name = "add_comment_url"
      url  = aws_lambda_function_url.add_comment_url.function_url
    },
    {
      name = "delete_comment_url"
      url  = aws_lambda_function_url.delete_comment_url.function_url
    },
    {
      name = "update_bio_url"
      url  = aws_lambda_function_url.update_bio_url.function_url
    },
    {
      name = "get_prompts_url"
      url  = aws_lambda_function_url.get_prompts_url.function_url
    },
    {
      name = "get_users_drawings_url"
      url  = aws_lambda_function_url.get_users_drawings_url.function_url
    },
    {
      name = "upload_profile_photo_url"
      url  = aws_lambda_function_url.upload_profile_photo_url.function_url
    },
    {
      name = "get_profile_photo_url"
      url  = aws_lambda_function_url.get_profile_photo_url.function_url
    },
    {
      name = "get_comments_url"
      url  = aws_lambda_function_url.get_comments_url.function_url
    },
    # ...
  ]
}