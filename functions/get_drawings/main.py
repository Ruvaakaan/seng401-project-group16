import boto3
import json
import base64

s3 = boto3.client("s3")

def get_specific_images(competition_id, drawing_id):
  return f"https://doodals-bucket-seng401.s3.amazonaws.com/{competition_id}/{drawing_id}"

def get_competition_images(competition_id):
  prefix = f"{competition_id}/"
  
  response = s3.list_objects_v2(Bucket="doodals-bucket-seng401", Prefix=prefix)
  image_urls = []
  if "Contents" in response:
    for obj in response["Contents"]:
      image_url = f"https://doodals-bucket-seng401.s3.amazonaws.com/{obj['Key']}"
      image_urls.append(image_url)
  
  return image_urls

def get_drawings(event, context):
  try:
    body = json.loads(event["body"])
    print(body)
    competition_id = body["competition_id"]
    drawing_id = body.get("drawing_id") 
  except KeyError:
    drawing_id = None

  if competition_id:
    if drawing_id:
      image_urls = get_specific_images(competition_id, drawing_id)
    else:
      image_urls = get_competition_images(competition_id)
    return {
      "statusCode": 200,
      "body": json.dumps({"image_urls": image_urls})
    }
  else:
    return {
      "statusCode": 400,
      "body": json.dumps({"message": "Competition ID is required"})
    }

  
  


