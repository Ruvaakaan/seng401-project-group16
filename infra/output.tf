# show the lambda function urls
output "lambda_names_and_urls" {
  value = [
    for lambda_func in local.lambda_urls : "${lambda_func.name}: ${lambda_func.url}"
  ]
}