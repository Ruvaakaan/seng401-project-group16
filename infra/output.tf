# show the lambda function urls
output "lambda_url" {
  value = [
    aws_lambda_function_url.create_user_url.function_url,
    aws_lambda_function_url.get_user_info_url.function_url,
    aws_lambda_function_url.get_drawings_url.function_url,
    aws_lambda_function_url.put_drawing_url.function_url,
    # ...
  ]
}

# show the api gateway urls
output "api_gateway_urls" {
  value = [
    aws_apigatewayv2_stage.dev_create_user_stage.invoke_url
  ]
}