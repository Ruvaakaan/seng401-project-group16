import boto3
import json
import datetime

dynamodb = boto3.client("dynamodb")

def add_comment(event, context):
  print(event)
  body = json.loads(event["body"])
  comment_id = body["comment_id"]
  drawing_id = body["drawing_id"]
  user_id = body["user_id"] 
  comment_text = body["comment_text"] 
  likes = 0
  date_created = str(datetime.datetime.now().timestamp())
  
  try:
    response = dynamodb.put_item(
      TableName="doodal-comments",
      Item={
        "comment_id": {"S": str(comment_id)},
        "user_id": {"S": str(user_id)},
        "comment_text": {"S": str(comment_text)},
        "drawing_id": {"S": str(drawing_id)},
        "likes": {"N": str(likes)},
        "date_created": {"S": str(date_created)}
      }
    )
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
  
  
  