import boto3
import json
import datetime
import uuid

dynamodb = boto3.client("dynamodb")

def add_comment(event, context):
  # print(event)
  body = json.loads(event["body"])
  drawing_id = body["drawing_id"]
  username = event["headers"]["username"]
  comment_text = body["comment_text"] 
  date_created = str(datetime.datetime.now().timestamp())
  
  try:
    response = dynamodb.put_item(
      TableName="doodal-comments",
      Item={
        "username": {"S": str(username)},
        "comment_text": {"S": str(comment_text)},
        "drawing_id": {"S": str(drawing_id)},
        "date_created": {"S": str(date_created)}
      }
    )
    return {
      "statusCode": 200,
      "headers": {"Content-Type": "application/json", 
                  "Access-Control-Allow-Headers" : "Content-Type",
                  "Access-Control-Allow-Origin": "*",
                  "Access-Control-Allow-Methods" : "OPTIONS, POST, GET"},
      "body": json.dumps(response)
    }
  except Exception as e:
    return {
      "statusCode": 500,
      "headers": {"Content-Type": "application/json",
                  "Access-Control-Allow-Headers" : "Content-Type",
                  "Access-Control-Allow-Origin": "*",
                  "Access-Control-Allow-Methods" : "OPTIONS, POST, GET"},
      "body": json.dumps(str(e))
    }
  
  
  