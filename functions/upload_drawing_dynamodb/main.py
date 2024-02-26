import boto3
import json
import base64
import uuid 
import datetime

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("doodal-drawings")

def upload_drawing_dynamodb(event, context):
  
  try:
    body = json.loads(event["body"])
    competition_id = body["competition_id"]
    date_created = str(datetime.datetime.now().timestamp())
    drawing_id = str(uuid.uuid4())
    likes = 0

    table.put_item(Item={
      "drawing_id": drawing_id,
      "user_id": uuid,
      "competition_id": competition_id,
      "likes": likes,
      "date_created": date_created,
      "s3_url": f"https://doodals-bucket-seng401.s3.amazonaws.com/{competition_id}/{drawing_id}"
    })

    return {
      "statusCode": 200,
      "headers": {"Content-Type": "application/json"},
      "body": f"Drawing added to doodal-drawings table."
    }
  except Exception as e:
    return {
      "statusCode": 500,
      "body": f"Error uploading image: {e}"
    }