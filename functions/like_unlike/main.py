import boto3
import json
import datetime 

dynamodb_client = boto3.client("dynamodb")

def update_drawing_likes(drawing_id, like_val):
  response = dynamodb_client.update_item(
    TableName="doodal-drawings",
    Key={
      'drawing_id': {"S": str(drawing_id)}
    },
    UpdateExpression='SET likes = likes + :val',
    ExpressionAttributeValues={":val": {"N":str(like_val)}},
    ReturnValues="UPDATED_NEW"
  )
  updated_likes = response['Attributes']['likes']
  return updated_likes

def delete_users_liked_photos(username, drawing_id):
  try:
    statement = "DELETE FROM \"doodal-likes\" WHERE username = ? AND drawing_id = ?"
    params = [{"S": str(username)}, {"S": str(drawing_id)}]
    response = dynamodb_client.execute_statement(
      Statement=statement,
      Parameters=params
    )
    # print(f"delete_users_liked_photos Response: {response}")
    return response
  except Exception as e:
    print(f"An error occurred: {e}")
    return None

def check_if_user_already_liked(username, drawing_id):
  response = dynamodb_client.scan(
    TableName="doodal-likes",
    FilterExpression="username = :uid AND drawing_id = :did",
    ExpressionAttributeValues={
      ":uid": {"S": str(username)},
      ":did": {"S": str(drawing_id)}
    }
  )
  # print(f"check_if_user_already_liked Response: {response}")
  items = response.get("Items", [])
  return items

def add_to_users_liked_photos(username, drawing_id):
  try:
    dynamodb_client.put_item(
      TableName="doodal-likes",
      Item={
        'username': {"S": str(username)},
        'drawing_id': {"S": str(drawing_id)}
      }
    )

  except Exception as e:
    print(f"An error occurred while putting item: {e}")

def like_unlike(event, context):
  try: 
    # print(event)
    body = json.loads(event['body'])
    drawing_id = body['drawing_id']
    username = event['headers']["username"]

    items = check_if_user_already_liked(username, drawing_id)
    # print(f"items: {items}")
    
    if not items:   
      add_to_users_liked_photos(username, drawing_id)
      updated_likes = update_drawing_likes(drawing_id, 1)
      return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json", 
                    "Access-Control-Allow-Headers" : "Content-Type",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods" : "OPTIONS, POST, GET"},
        "body": True
      }
    else:    
      updated_likes = update_drawing_likes(drawing_id, -1)  
      # print(f"updated likes after deleting: {updated_likes}")
      response = delete_users_liked_photos(username, drawing_id)
      # print(f"after delete from like table: {response}")
      
      return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json",
                    "Access-Control-Allow-Headers" : "Content-Type",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods" : "OPTIONS, POST, GET"},
        "body": True
      }
  except Exception as e:
    return {
      "statusCode": 500,
      "headers": {"Content-Type": "application/json"},
      "body": False
    }
