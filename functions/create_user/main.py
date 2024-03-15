import boto3
import json
import datetime

dynamodb_resource = boto3.resource("dynamodb")
table = dynamodb_resource.Table("doodal-users")

def create_user(event, context):
  try:
    uuid = event["request"]["userAttributes"]["sub"]
    username = event["userName"]
    email = event["request"]["userAttributes"]["email"]
    xp = 0
    bio = "Create a bio!"
    date_created = str(datetime.datetime.now().timestamp())
    
    table.put_item(Item={
      "user_id": uuid,
      "username": username,
      "email": email,
      "experience": xp,
      "bio": bio,
      "date_created": date_created,
      "profile_photo_url": ""
    })
    return event
  except Exception as e:
    print(e)
    return {
      "statusCode": 500,
      "headers": {"Content-Type": "application/json"},
      "body": json.dumps({"error": str(e)})
    }
    

