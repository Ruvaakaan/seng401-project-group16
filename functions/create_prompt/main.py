import boto3
import json

dynamodb = boto3.client("dynamodb")

def create_prompt(event, context):
  try:
    body = json.loads(event["body"])
    competition_id = body["competition_id"]
    prompt = body["prompt"]
    
    statement = "SELECT * FROM \"doodal-prompts\" WHERE prompt = ?"
    params = [{"S": str(prompt)}]
    response = dynamodb.execute_statement(
      Statement=statement,
      Parameters=params
    )
    print(response)
    
    items = response["Items"]
    
    if not items:
      response = dynamodb.put_item(
        TableName="doodal-prompts",
        Item={
          "competition_id": {"S": str(competition_id)},
          "prompt": {"S": str(prompt)}
        }
      )
      return {
        "statusCode": 200,
        "body": f"{response}"
      }
    else:
      return {
        "statusCode": 400,
        "body": f"Error: Prompt ({prompt}) already exists."
      }
  except Exception as e:
    return {
      "statusCode": 500,
      "body": f"Internal Server Error {e}"
    }
    
  
  


  

