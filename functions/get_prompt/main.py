import json
import boto3

dynamodb = boto3.client("dynamodb")

def get_prompt(event, context):
  print(event)
  body = json.loads(event["body"])
  competition_id = body["competition_id"]
  
  try:
    statement = "SELECT * FROM \"doodal-prompts\" WHERE competition_id = ?"
    params = [{"S": str(competition_id)}]
    response = dynamodb.execute_statement(
      Statement=statement,
      Parameters=params
    )
    print("response:", response)
    print("items", response["Items"])
    
    return {
      "statusCode": 200,
      "headers": {"Content-Type": "application/json"},
      "body": json.dumps(response["Items"])
    }
  except Exception as e:
    return {
      "statusCode": 500,
      "body": str(e)
    }