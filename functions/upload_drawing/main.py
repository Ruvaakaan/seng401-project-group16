import boto3
import json
import base64
import uuid 
import datetime

s3 = boto3.client("s3")
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("doodal-drawings")

def upload_drawing(event, context):
  try:
    print(event)

    
    body = json.loads(event["body"])
    competition_id = body["competition_id"]
    user_id = event['headers']["user_id"]
    username = event['requestContext']['authorizer']['claims']['username']
    print(username)
    image_data = base64.b64decode(body["image_data"])
  
    drawing_id = str(uuid.uuid4())
    date_created = str(datetime.datetime.now().timestamp())
    likes = 0
    
    filepath = f"{competition_id}/{drawing_id}.jpg"

    s3.put_object(Bucket="doodals-bucket-seng401", Key=filepath, Body=image_data)

    table.put_item(Item={
      "drawing_id": drawing_id,
      "competition_id": competition_id,
      "user_id": user_id,
      "likes": likes,
      "date_created": date_created,
      "s3_url": f"https://doodals-bucket-seng401.s3.us-west-2.amazonaws.com/{competition_id}/{drawing_id}.jpg",
      "username": username
    })
    return {
      "statusCode": 200,
      "headers": {"Content-Type": "application/json",
          "Access-Control-Allow-Headers" : "Content-Type",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods" : "OPTIONS, POST, GET"
      },
      "body": f"Image {drawing_id} uploaded to S3 bucket."
    }
  except Exception as e:
    return {
      "statusCode": 500,
      "headers": {"Content-Type": "application/json",
          "Access-Control-Allow-Headers" : "Content-Type",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods" : "OPTIONS, POST, GET"
      },
      "body": json.dumps({"error": str(e)})
    }
