import boto3
import json
import datetime

s3 = boto3.client("s3")
dynamodb = boto3.client("dynamodb")

def update_prompts(event, context):
  try:
    response = dynamodb.scan(TableName="doodal-prompts")
    prompts = response["Items"]
    
    for prompt in prompts:
      prompt_id = prompt["competition_id"]["S"]
      prompt_difficulty = prompt["difficulty"]["S"]
      date_created = float(prompt["date_created"]["S"])
      
      creation_date = datetime.datetime.fromtimestamp(date_created)
      print(creation_date)
      current_date = datetime.datetime.now()
      print(current_date)
      
      if prompt_difficulty.lower() == "easy":
        threshold = datetime.timedelta(days=1)
      elif prompt_difficulty.lower() == "medium":
        threshold = datetime.timedelta(days=3)
      elif prompt_difficulty.lower() == "hard":
        threshold = datetime.timedelta(days=5)
      else:
        raise ValueError("Invalid difficulty level")
      
      time_difference = current_date - creation_date
      
      if time_difference >= threshold:
        # Update the prompt's old_prompt attribute to True
        dynamodb.update_item(
          TableName="doodal-prompts",
          Key={"competition_id": {"S": prompt_id}},
          UpdateExpression="SET old_prompt = :val",
          ExpressionAttributeValues={":val": {"BOOL": True}}
        )
        
    return {
      "statusCode": 200,
      "headers": {
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST, GET"
      },
      "body": json.dumps("Prompts Updated Successfully")
    }
  except Exception as e:
    print(e)
    return {
      "statusCode": 500,
      "headers": {"Content-Type": "application/json"},
      "body": json.dumps(str(e))
    }
