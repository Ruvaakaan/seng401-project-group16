import boto3
import json
import base64

s3 = boto3.client("s3")
dynamodb = boto3.client("dynamodb")

def upload_profile_photo(event, context):
  try:
    print(event)
    body = json.loads(event["body"])
    user_id = body["user_id"]
    image_data = base64.b64decode(body["image_data"])
    
    filepath = f"profile_photos/{user_id}.jpg"
    profile_photo_url = f"https://doodals-bucket-seng401.s3.us-west-2.amazonaws.com/profile_photos/{user_id}.jpg"
    
    response = dynamodb.update_item(
      TableName="doodal-users",
      Key={
        'user_id': {"S": str(user_id)}
      },
      UpdateExpression='SET profile_photo_url = :val',
      ExpressionAttributeValues={":val": {"S":str(profile_photo_url)}},
      ReturnValues="UPDATED_NEW"
    )
    updated_bio = response['Attributes']['profile_photo_url']
    print(updated_bio)
    
    s3.put_object(Bucket="doodals-bucket-seng401", Key=filepath, Body=image_data)
    
    return {
      "statusCode": 200,
      "headers": {"Content-Type": "application/json"},
      "body": f"Profile photo updated and uploaded to S3 bucket."
    }
  except Exception as e:
    return {
      "statusCode": 500,
      "headers": {"Content-Type": "application/json"},
      "body": json.dumps({"error": str(e)})
    }