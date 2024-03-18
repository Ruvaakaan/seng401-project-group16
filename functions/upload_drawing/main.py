import boto3
import json
import base64
import uuid 
import datetime

s3 = boto3.client("s3")
dynamodb = boto3.resource("dynamodb")
dynamodb1 = boto3.client("dynamodb")
table = dynamodb.Table("doodal-drawings")

def verify_one_entry(c, u):
  try:
    statement = "SELECT * FROM \"doodal-drawings\" WHERE competition_id = ? AND username = ?"
    params = [{"S": str(c)}, {"S": str(u)}]
    response = dynamodb1.execute_statement(
        Statement=statement,
        Parameters=params
    )
    items = response["Items"]
    if len(items) == 0: # no entry found, let user enter
      return True
    else:
      return False
  except Exception as e:
    print(e)
    return False
    
def upload_drawing(event, context):
  try:
    print(event)

    
    body = json.loads(event["body"])
    competition_id = body["competition_id"]
    username = event['headers']["username"]
    username = event['requestContext']['authorizer']['claims']['username']
    print(username)
    image_data = base64.b64decode(body["image_data"])
    
    res = verify_one_entry(competition_id, username)
    
    if not res:
      return {
        "statusCode": 202,
        "headers": {"Content-Type": "application/json",
          "Access-Control-Allow-Headers" : "Content-Type",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods" : "OPTIONS, POST, GET"
          },
        "body": "User already entered in this competition"
      }
  
    drawing_id = str(uuid.uuid4())
    date_created = str(datetime.datetime.now().timestamp())
    likes = 0
    
    filepath = f"{competition_id}/{drawing_id}.jpg"

    s3.put_object(Bucket="doodals-bucket-seng401", Key=filepath, Body=image_data)

    table.put_item(Item={
      "drawing_id": drawing_id,
      "competition_id": competition_id,
      "username": username,
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