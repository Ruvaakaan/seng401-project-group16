import boto3
import json
import base64

dynamodb = boto3.client("dynamodb")

def get_profile_photo(event, context):
  try:
    print(event)
    body = json.loads(event["body"])
    user_id = body["user_id"]

    statement = "SELECT profile_photo_url FROM \"doodal-users\" WHERE user_id = ?"
    params = [{"S": str(user_id)}]

    response = dynamodb.execute_statement(
      Statement=statement,
      Parameters=params
    )
    print("response:", response)
    item = response["Items"][0]["profile_photo_url"]

    return {
      "statusCode": 200,
      "headers": {"Content-Type": "application/json"},
      "body": f"Profile photo retrieved {item}."
    }
  except Exception as e:
    return {
      "statusCode": 500,
      "headers": {"Content-Type": "application/json"},
      "body": json.dumps({"error": str(e)})
    }