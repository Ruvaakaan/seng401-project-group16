# api gateway apis
resource "aws_apigatewayv2_api" "create_user_api" {
  name          = "create_user_api"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_integration" "create_user_integration" {
  api_id                 = aws_apigatewayv2_api.create_user_api.id
  integration_type       = "AWS_PROXY"
  integration_method     = "POST"
  integration_uri        = aws_lambda_function.create_user_lambda.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "lambda_route" {
  api_id    = aws_apigatewayv2_api.create_user_api.id
  route_key = "POST /create_user"

  target = "integrations/${aws_apigatewayv2_integration.create_user_integration.id}"
}

resource "aws_cloudwatch_log_group" "create_user_api_gateway_logs" {
  name              = "/aws/apigateway/${aws_apigatewayv2_api.create_user_api.name}"
  retention_in_days = 1  
}

resource "aws_apigatewayv2_stage" "dev_create_user_stage" {
  api_id      = aws_apigatewayv2_api.create_user_api.id
  name        = "dev_create_user_stage"
  auto_deploy = true

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.create_user_api_gateway_logs.arn

    format = jsonencode({
      requestId               = "$context.requestId"
      sourceIp                = "$context.identity.sourceIp"
      requestTime             = "$context.requestTime"
      protocol                = "$context.protocol"
      httpMethod              = "$context.httpMethod"
      resourcePath            = "$context.resourcePath"
      routeKey                = "$context.routeKey"
      status                  = "$context.status"
      responseLength          = "$context.responseLength"
      integrationErrorMessage = "$context.integrationErrorMessage"
    })
  }
}