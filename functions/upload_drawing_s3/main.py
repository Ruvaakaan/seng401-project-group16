import boto3
import json
import base64
import uuid 
import datetime
import time

s3 = boto3.client("s3")
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("doodal-drawings")

def upload_drawing_s3(event, context):
  
  try:
    body = json.loads(event["body"])
    competition_id = body["competition_id"]
    image_data = base64.b64decode(body["image_data"])
    drawing_id = str(uuid.uuid4())
    


    filepath = f"{competition_id}/{drawing_id}.jpg"

    s3.put_object(Bucket="doodals-bucket-seng401", Key=filepath, Body=image_data)
    
    time.sleep(2)
    
    date_created = str(datetime.datetime.now().timestamp())
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
      "body": f"Image {drawing_id} uploaded to S3 bucket."
    }
  except Exception as e:
    return {
      "statusCode": 500,
      "body": f"Error uploading image: {e}"
    }