import boto3
import json

dynamodb = boto3.client("dynamodb")

# get all prompts from prompts table
def select_prompts(prompt):
  statement = "SELECT * FROM \"doodal-prompts\" WHERE prompt = ?"
  params = [{"S": str(prompt)}]
  response = dynamodb.execute_statement(
    Statement=statement,
    Parameters=params
  )
  print(f"select_prompts Response: {response}")
  items = response["Items"]
  return items

# put new prompt into prompt table
def put_new_prompt(prompt, competition_id):
  response = dynamodb.put_item(
    TableName="doodal-prompts",
    Item={
      "competition_id": {"S": str(competition_id)},
      "prompt": {"S": str(prompt)}
    }
  )
  return response

def create_prompt(event, context):
  try:
    body = json.loads(event["body"])
    competition_id = body["competition_id"]
    prompt = body["prompt"]
    
    if not prompt.isalpha():
      return {
      "statusCode": 400,
      "body": "Error: Invalid prompt."
    }
    items = select_prompts(prompt)
    
    if not items:
      response = put_new_prompt(prompt, competition_id)
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
      "body": f"Error: Internal server error: {e}."
    }
    
  
  


  

