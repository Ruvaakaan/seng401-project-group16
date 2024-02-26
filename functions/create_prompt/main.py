import boto3
import json
from openai import OpenAI
import uuid

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("doodal-prompts")
ssm = boto3.client("ssm", "us-west-2")

def get_openai_response():

  response = ssm.get_parameter(
    Name='doodal_openapi',
    WithDecryption=True
  )
  openai_api_key = response['Parameter']['Value']

  client = OpenAI(api_key=openai_api_key)
  print(openai_api_key)
  
  completion = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "Give me something to draw. Make it at most 10 tokens and at most 5 words. No special characters or numbers. Don't repeat yourself."}
    ],
    max_tokens=10,
    n=1,
    temperature=0.6
  )

  print(completion.choices[0].message.content)
  return completion.choices[0].message.content

def create_prompt(event, context):
  try:
    openai_response = get_openai_response()
    competition_id = str(uuid.uuid4())
    table.put_item(Item={
      "competition_id": competition_id,
      "prompt": openai_response
    })
    
    return {
      "statusCode": 200,
      "headers": {"Content-Type": "application/json"},
      "body": f"Prompt: \"{openai_response}\" with competition_id: {competition_id} generated."
    }

  except Exception as e:
    return {
      "statusCode": 500,
      "body": str(e)
    }