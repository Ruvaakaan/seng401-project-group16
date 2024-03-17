import boto3
import json

dynamodb = boto3.client("dynamodb")

def verify_user(requested,draw_id,dc):
  try:
    statement = "SELECT * FROM \"doodal-comments\" WHERE drawing_id = ? AND date_created = ?"
    params = [{"S": str(draw_id)}, {"S": str(dc)}]
    response = dynamodb.execute_statement(
        Statement=statement,
        Parameters=params
    )
    items = response["Items"]
    print(items)
    print(items[0]["username"]["S"])
    if items[0]["username"]["S"] == requested:
      return True
    else:
      return False
  except Exception as e:
    print(e)
    return False

def delete_comment(event, context):
  try:
    print(event)
    body = json.loads(event["body"])
    drawing_id = body["drawing_id"]
    username = event['headers']["username"]
    date_created = body["date_created"]

    res = verify_user(username,drawing_id,date_created)

    if not res:
      return {
      "statusCode": 401,
      "headers": {"Content-Type": "application/json",
          "Access-Control-Allow-Headers" : "Content-Type",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods" : "OPTIONS, POST, GET, DELETE"
      },
      "body": "Unauthorized user tried to delete post."
    }

    response = dynamodb.delete_item(
      TableName="doodal-comments",
      Key={
          'drawing_id': {'S': drawing_id},
          'date_created': {'S': str(date_created)}
        }
      )

    print(f"Response: {response}")
    return {
      "statusCode": 200,
      "headers": {"Content-Type": "application/json",
          "Access-Control-Allow-Headers" : "Content-Type",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods" : "OPTIONS, POST, GET, DELETE"
      },
      "body": json.dumps(response)
    }
  except Exception as e:
    return {
      "statusCode": 500,
      "headers": {"Content-Type": "application/json",
          "Access-Control-Allow-Headers" : "Content-Type",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods" : "OPTIONS, POST, GET, DELETE"
      },
      "body": json.dumps({"error": str(e)})
    }
  
  
  