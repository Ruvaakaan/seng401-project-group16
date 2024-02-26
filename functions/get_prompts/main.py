import json
import boto3

dynamodb = boto3.client("dynamodb")

def get_prompts(event, context):
  
  try:
    statement = "SELECT * FROM \"doodal-prompts\""
    response = dynamodb.execute_statement(
      Statement=statement
    )
    print("response:", response)
    print("items", response["Items"])
    
    return {
      "statusCode": 200,
      "body": response["Items"]
    }
  except Exception as e:
    return {
      "statusCode": 500,
      "headers": {"Content-Type": "application/json"},
      "body": json.dumps({"error": str(e)})
    }