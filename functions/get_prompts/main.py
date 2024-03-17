import json
import boto3

dynamodb = boto3.client("dynamodb")

def get_prompts(event, context):
  
  try:
    statement = "SELECT * FROM \"doodal-prompts\""
    response = dynamodb.execute_statement(
      Statement=statement
    )
    prompts = response["Items"]
    
    new_prompts = []
    old_prompts = []
    
    for prompt in prompts:
      if prompt["old_prompt"]["BOOL"] == True:
        old_prompts.append(prompt)  # add prompt to old prompts
      else:
        new_prompts.append(prompt)  # add prompt to new prompts
    
    return {
      "statusCode": 200,
      "headers":{
                "Access-Control-Allow-Headers" : "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods" : "OPTIONS, POST, GET"
            },
      "body": {"new_prompts": new_prompts, "old_prompts": old_prompts}
    }
  except Exception as e:
    return {
      "statusCode": 500,
      "headers": {"Content-Type": "application/json"},
      "body": json.dumps({"error": str(e)})
    }