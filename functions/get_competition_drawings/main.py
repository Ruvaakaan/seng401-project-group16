import boto3
import json
import base64

s3 = boto3.client("s3")
dynamodb = boto3.client("dynamodb")

def get_users_liked(user_id, drawing_ids):
  for drawing_id in drawing_ids:
        try:
            response = dynamodb.query(
                TableName='doodal-likes',
                KeyConditionExpression='user_id = :uid AND drawing_id = :did',
                ExpressionAttributeValues={
                    ':uid': {'S': user_id},
                    ':did': {'S': drawing_id}
                }
            )
            print(f"response from query: {response}")
            # if response["Items"]:
            #     print(f"User with ID {user_id} has already liked drawing with ID {drawing_id}")
            #     return True
        except Exception as e:
            print(f"An error occurred: {e}")
    # print("User has not liked any of the specified drawings")
    # return False
  return

def get_competition_drawings(event, context):
  
  try:
    print(event)
    competition_id = event["competition_id"]

    if competition_id:

      statement = "SELECT * FROM \"doodal-drawings\" WHERE competition_id = ?"
      params = [{"S": str(competition_id)}]

      response = dynamodb.execute_statement(
        Statement=statement,
        Parameters=params
      )
      
      
      items = response.get("Items", [])
      drawing_ids = []
      for item in items:
        drawing_ids.append(item["drawing_id"]["S"])
      print(f"drawing ids: {drawing_ids}")
        
        
      get_users_liked("ad0d1dc5-fd5e-435d-b2a0-81b0d549aa28", drawing_ids)  
        
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