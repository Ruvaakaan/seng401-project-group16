import boto3
import json
import base64

s3 = boto3.client("s3")
dynamodb = boto3.client("dynamodb")

# def get_competition_images(competition_id):
#   prefix = f"{competition_id}/"
  
#   response = s3.list_objects_v2(Bucket="doodals-bucket-seng401", Prefix=prefix)
#   image_urls = []
#   if "Contents" in response:
#     for obj in response["Contents"]:
#       image_url = f"https://doodals-bucket-seng401.s3.amazonaws.com/{obj['Key']}"
#       image_urls.append(image_url)
  
#   return image_urls

def get_drawings(event, context):
  
  try:
    competition_id = event["competition_id"]

    if competition_id:
      # image_urls = get_competition_images(competition_id)
      statement = "SELECT * FROM \"doodal-drawings\" WHERE competition_id = ?"
      params = [{"S": str(competition_id)}]

      response = dynamodb.execute_statement(
        Statement=statement,
        Parameters=params
      )
      items = response.get("Items", [])
      return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json",
                    "Access-Control-Allow-Headers" : "Content-Type",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods" : "OPTIONS, POST, GET"
        },
        "body": json.dumps({"items": items})
      }
    else:
      return {
        "statusCode": 400,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps({"message": "Competition ID is required"})
      }
  except Exception as e:
    return {
      "statusCode": 500,
      "headers": {"Content-Type": "application/json"},
      "body": json.dumps({"error": str(e)})
    }