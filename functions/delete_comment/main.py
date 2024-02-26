import boto3
import json
import datetime

dynamodb = boto3.client("dynamodb")

def delete_comment(event, context):
  print(event)
  body = json.loads(event["body"])
  comment_id = body["comment_id"]
  
  try:
    statement = "DELETE FROM \"doodal-comments\" WHERE comment_id = ?"
    params = [{"S": str(comment_id)}]
    response = dynamodb.execute_statement(
      Statement=statement,
      Parameters=params
    )
    print(f"Response: {response}")
    return {
      "statusCode": 200,
      # "headers":{
      #   "Access-Control-Allow-Headers" : "Content-Type",
      #   "Access-Control-Allow-Origin": "*",
      #   "Access-Control-Allow-Methods" : "OPTIONS, POST, GET"
      # },
      "body": f"Response: {response}."
    }
  except Exception as e:
    return {
      "statusCode": 500,
      "body": f"Error: {e}."
    }
  
  
  