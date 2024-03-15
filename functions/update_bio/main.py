import json
import boto3

dynamodb_client = boto3.client("dynamodb")

def update_bio(event, context):
  try:
    body = json.loads(event["body"])
    username = event['headers']["username"]
    bio = body["bio"]
    
    response = dynamodb_client.update_item(
      TableName="doodal-users",
      Key={
        'username': {"S": str(username)}
      },
      UpdateExpression='SET bio = :val',
      ExpressionAttributeValues={":val": {"S":str(bio)}},
      ReturnValues="UPDATED_NEW"
    )
    updated_bio = response['Attributes']['bio']
    return {
      "statusCode": 200,
      "headers": {"Content-Type": "application/json",
                  "Access-Control-Allow-Headers" : "Content-Type",
                  "Access-Control-Allow-Origin": "*",
                  "Access-Control-Allow-Methods" : "OPTIONS, POST, GET"},
      "body": updated_bio
    }
  except Exception as e:
    return {
      "statusCode": 500,
      "headers": {"Content-Type": "application/json",
                  "Access-Control-Allow-Headers" : "Content-Type",
                  "Access-Control-Allow-Origin": "*",
                  "Access-Control-Allow-Methods" : "OPTIONS, POST, GET"},
      "body": json.dumps({"error": str(e)})
    }