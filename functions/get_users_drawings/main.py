import json
import boto3

dynamodb = boto3.client("dynamodb")

def get_users_drawings(event, context):
  print(event)
  username = event["requestContext"]["authorizer"]["claims"]["sub"]
  print(username)
  
  try:
    statement = "SELECT * FROM \"doodal-drawings\" WHERE username = ?"
    params = [{"S": str(username)}]
    response = dynamodb.execute_statement(
      Statement=statement,
      Parameters=params
    )
    items = response.get("Items", [])
    print(items)
    
    return {
      "statusCode": 200,
      "headers": {"Content-Type": "application/json",
                    "Access-Control-Allow-Headers" : "Content-Type",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods" : "OPTIONS, POST, GET"
        },
      "body": json.dumps({"items": items})
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