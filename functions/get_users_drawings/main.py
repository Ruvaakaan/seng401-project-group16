import json
import boto3

dynamodb = boto3.client("dynamodb")

def get_users_liked(username, drawing_ids):
    users_liked_drawings = {}
    for drawing_id in drawing_ids:
        try:
            print(f"username: {username}")
            print(f"drawing id: {drawing_id}")
            statement = "SELECT * FROM \"doodal-likes\" WHERE username = ? AND drawing_id = ?"
            params = [{"S": str(username)}, {"S": str(drawing_id)}]
            response = dynamodb.execute_statement(
                Statement=statement,
                Parameters=params
            )
            print(f"response from query: {response}")
            if response.get('Items'):
                users_liked_drawings[drawing_id] = True
            else:
                users_liked_drawings[drawing_id] = False
        except Exception as e:
            print(f"An error occurred: {e}")
    print(f"users liked drawings: {users_liked_drawings}")
    return users_liked_drawings

def get_users_drawings(event, context):
  print(event)
  body = json.loads(event["body"])
  username = body["username"]
  print(username)
  
  try:
    statement = "SELECT * FROM \"doodal-drawings\" WHERE username = ?"
    params = [{"S": str(username)}]
    response = dynamodb.execute_statement(
      Statement=statement,
      Parameters=params
    )
    items = response["Items"]
    
    drawing_ids = []
    for item in items:
      drawing_ids.append(item["drawing_id"]["S"])
    
    users_liked = {}
    if username:
        users_liked = get_users_liked(username, drawing_ids)
        
    for item in items:

        drawing_id = item["drawing_id"]["S"]
        item["liked_by_user"] = users_liked.get(drawing_id, False)
        
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