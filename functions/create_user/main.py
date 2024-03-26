import boto3
import json
import datetime
import random

dynamodb_resource = boto3.resource("dynamodb")
table = dynamodb_resource.Table("doodal-users")

def create_user(event, context):
  try:
    uuid = event["request"]["userAttributes"]["sub"]
    username = event["userName"]
    email = event["request"]["userAttributes"]["email"]
    sentences = [
      "My soul yearns for the art of drawing!",
      "Drawing beckons to me, a thirst unquenchable!",
      "Within me burns an insatiable thirst for drawing!",
      "Drawing calls to me, igniting a deep thirst within!",
      "The passion for drawing courses through me like an unyielding thirst!",
      "In the depths of my being, I crave the act of drawing!",
      "To draw is to satisfy a thirst that resides deep within my essence!",
      "The urge to draw consumes me, a thirst that can never be slaked!",
      "My spirit longs for the creative release found in drawing!",
      "Drawing is my sustenance, my eternal thirst quencher!",
      "Drawing's alright."
    ]
    bio = random.choice(sentences)

    date_created = str(datetime.datetime.now().timestamp())
    
    table.put_item(Item={
      "user_id": uuid,
      "username": username,
      "email": email,
      "bio": bio,
      "date_created": date_created,
      "profile_photo_url": "https://doodals-bucket-seng401.s3.us-west-2.amazonaws.com/website+photos/octopus.PNG"
    })
    return event
  except Exception as e:
    print(e)
    return {
      "statusCode": 500,
      "headers": {"Content-Type": "application/json"},
      "body": json.dumps({"error": str(e)})
    }
    

