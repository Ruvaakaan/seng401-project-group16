import boto3
import json

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

def delete_users_liked_photos(user_id, drawing_id):
  statement = "DELETE FROM \"doodal-likes\" WHERE user_id = ? AND drawing_id = ?"
  params = [{"S": str(user_id)}, {"S": str(drawing_id)}]
  response = dynamodb_client.execute_statement(
    Statement=statement,
    Parameters=params
  )
  print(f"delete_users_liked_photos Response: {response}")
  return response

def check_if_user_already_liked(user_id, drawing_id):
  response = dynamodb_client.scan(
    TableName="doodal-likes",
    FilterExpression="user_id = :uid AND drawing_id = :did",
    ExpressionAttributeValues={
      ":uid": {"S": str(user_id)},
      ":did": {"S": str(drawing_id)}
    }
  )
  print(f"check_if_user_already_liked Response: {response}")
  items = response.get("Items", [])
  return items

def add_to_users_liked_photos(user_id, drawing_id):
  dynamodb_client.put_item(
    TableName="doodal-likes",
    Item={
      'user_id': {"S": str(user_id)},
      'drawing_id': {"S": str(drawing_id)}
    }
  )

def like_unlike(event, context):
  try: 
    body = json.loads(event["body"])
    drawing_id = body["drawing_id"]
    user_id = body["user_id"]
    
    items = check_if_user_already_liked(user_id, drawing_id)
    
    if not items:   
      add_to_users_liked_photos(user_id, drawing_id)
      updated_likes = update_drawing_likes(drawing_id, 1)
      return {
        "statusCode": 200,
        "body": f"Drawing not previously liked, likes for drawing_id {drawing_id} incremented to {updated_likes}"
      }
    else:    
      updated_likes = update_drawing_likes(drawing_id, -1)  
      delete_users_liked_photos(user_id, drawing_id)
      
      return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json"},
        "body": f"Unliked drawing_id {drawing_id} deincremented to {updated_likes}"
      }
  except Exception as e:
    return {
      "statusCode": 500,
      "headers": {"Content-Type": "application/json"},
      "body": json.dumps({"error": str(e)})
    }
