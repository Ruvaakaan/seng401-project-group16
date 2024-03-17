import boto3
import json

dynamodb = boto3.client("dynamodb")

def get_comments(event, context):
  try:
    print(event)
    body = json.loads(event["body"])
    drawing_id = body["drawing_id"]

    statement = "SELECT * FROM \"doodal-comments\" WHERE drawing_id = ?"
    params = [{"S": str(drawing_id)}]

    response = dynamodb.execute_statement(
      Statement=statement,
      Parameters=params
    )
    print("response:", response)

    return {
      "statusCode": 200,
      "headers": {"Content-Type": "application/json"},
      "body": json.dumps(response["Items"])
    }
  except Exception as e:
    return {
      "statusCode": 500,
      "headers": {"Content-Type": "application/json"},
      "body": json.dumps({"error": str(e)})
    }