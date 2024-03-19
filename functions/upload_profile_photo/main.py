import boto3
import json
import base64
import uuid

s3 = boto3.client("s3")
dynamodb = boto3.client("dynamodb")

def upload_profile_photo(event, context):
  try:
    body = json.loads(event["body"])
    username = event['headers']["username"]
    image_data = base64.b64decode(body["image_data"])
    
    user_uuid = str(uuid.uuid4())
    
    filepath = f"profile_photos/{user_uuid}.jpg"
    profile_photo_url = f"https://doodals-bucket-seng401.s3.us-west-2.amazonaws.com/profile_photos/{user_uuid}.jpg"

    response_delete = dynamodb.get_item(
        TableName="doodal-users",
        Key={"username": {"S": str(username)}},
        ProjectionExpression="profile_photo_url"
    )
    old_profile_photo_url = response_delete.get("Item", {}).get("profile_photo_url", {}).get("S")
    
    if old_profile_photo_url:
        old_key = old_profile_photo_url[:].split('/')[-1]
        try:
          s3.delete_object(Bucket="doodals-bucket-seng401", Key=f"profile_photos/{old_key}")
          print(f"Object with key {old_key} deleted successfully.")
        except Exception as e:
          print(f"Failed to delete object: {e}")
    
    response = dynamodb.update_item(
      TableName="doodal-users",
      Key={
        'username': {"S": str(username)}
      },
      UpdateExpression='SET profile_photo_url = :val',
      ExpressionAttributeValues={":val": {"S":str(profile_photo_url)}},
      ReturnValues="UPDATED_NEW"
    )
    new_url = response['Attributes']['profile_photo_url']
    # print(updated_bio)
    
    s3.put_object(Bucket="doodals-bucket-seng401", Key=filepath, Body=image_data)
    
    return {
      "statusCode": 200,
      "headers": {"Content-Type": "application/json",
                  "Access-Control-Allow-Headers" : "Content-Type",
                  "Access-Control-Allow-Origin": "*",
                  "Access-Control-Allow-Methods" : "OPTIONS, POST, GET"},
      "body": f"Profile photo updated and uploaded to S3 bucket."
    }
  except Exception as e:
    return {
      "statusCode": 500,
      "headers": {"Content-Type": "application/json",
                  "Access-Control-Allow-Headers" : "Content-Type",
                  "Access-Control-Allow-Origin": "*",
                  "Access-Control-Allow-Methods" : "OPTIONS, POST, GET"},
      "body": json.dumps({"error": str(e)})
    }