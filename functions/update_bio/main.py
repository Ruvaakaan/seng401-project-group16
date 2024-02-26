import json
import boto3

dynamodb_client = boto3.client("dynamodb")

def update_bio(event, context):
  try:
    body = json.loads(event["body"])
    user_id = body["user_id"]
    bio = body["bio"]
    
    response = dynamodb_client.update_item(
      TableName="doodal-users",
      Key={
        'user_id': {"S": str(user_id)}
      },
      UpdateExpression='SET bio = :val',
      ExpressionAttributeValues={":val": {"S":str(bio)}},
      ReturnValues="UPDATED_NEW"
    )
    updated_bio = response['Attributes']['bio']
    return {
      "statusCode": 200,
      "headers": {"Content-Type": "application/json"},
      "body": updated_bio
    }
  except Exception as e:
    return {
      "statusCode": 500,
      "headers": {"Content-Type": "application/json"},
      "body": json.dumps({"error": str(e)})
    }