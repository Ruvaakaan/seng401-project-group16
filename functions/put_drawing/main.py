import boto3
import json
import base64

s3 = boto3.client("s3")

def put_drawing(event, context):
  body = json.loads(event["body"])
  competition_id = body["competition_id"]
  drawing_id = body["drawing_id"]
  image_data = base64.b64decode(body["image_data"])

  file_name = f"{competition_id}/{drawing_id}.jpg"

  try:
    s3.put_object(Bucket="doodals-bucket-seng401", Key=file_name, Body=image_data)
    return {
      "statusCode": 200,
      "body": f"Image uploaded to S3 bucket doodals-bucket-seng401 at {file_name}"
    }
  except Exception as e:
    return {
      "statusCode": 500,
      "body": f"Error uploading image: {e}"
    }