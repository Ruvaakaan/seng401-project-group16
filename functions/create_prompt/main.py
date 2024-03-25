import boto3
import json
from openai import OpenAI
import uuid
import datetime
import random
import re

dynamodb_resource = boto3.resource("dynamodb")
table = dynamodb_resource.Table("doodal-prompts")
ssm = boto3.client("ssm", "us-west-2")
dynamodb = boto3.client("dynamodb")

def get_openai_response():
  response = ssm.get_parameter(
    Name='doodal_openapi',
    WithDecryption=True
  )
  openai_api_key = response['Parameter']['Value']

  client = OpenAI(api_key=openai_api_key)
  
  prompt_ideas = [
    "Dragon",
    "Castle",
    "Robot",
    "Unicorn",
    "Rocket",
    "Wizard",
    "Mermaid",
    "Guitar",
    "Octopus",
    "Tiger",
    "Jungle",
    "Spaceship",
    "Volcano",
    "Phoenix",
    "Galaxy",
    "Fairy",
    "Pirate",
    "Circus",
    "Ballet",
    "Dream",
    "Adventure",
    "Mystery",
    "Wonderland",
    "Lighthouse",
    "Rainbow",
    "Sphinx",
    "Kraken",
    "Ninja",
    "Magician",
    "Zombie",
    "Alien",
    "Sword",
    "Atlantis",
    "Eclipse",
    "Moonlight",
    "Fireworks",
    "Eagle",
    "Oasis",
    "Witch",
    "Yeti",
    "Safari",
    "Sorcerer",
    "Time machine",
    "Magic carpet",
    "Enchanted forest",
    "Atlantis",
    "Carnival",
    "One Piece Anime",
  ]
  
  prompt_idea = random.choice(prompt_ideas)
  
  difficulty_levels = ["easy", "medium", "hard"]
  difficulty = random.choice(difficulty_levels)
  
  if difficulty.lower() == "easy":
    max_tokens = 10
    max_words = 1
  elif difficulty.lower() == "medium":
    max_tokens = 20
    max_words = 3
  elif difficulty.lower() == "hard":
    max_tokens = 30
    max_words = 5
  
  prompt = f"Describe something unique to draw that is related to {prompt_idea}. No more than {max_words} words."
  
  completion = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": prompt}
    ],
    max_tokens=max_tokens,
    n=1,
    temperature=0.6
  )
  response = completion.choices[0].message.content
  response = re.sub(r'[^\w\s]', '', response)
  print(response)
  return difficulty, response

def create_prompt(event, context):
  try:
    response = dynamodb.scan(
      TableName="doodal-prompts",
      FilterExpression="old_prompt = :val",
      ExpressionAttributeValues={":val": {"BOOL": False}}
    )
    prompts = response["Items"]

    if len(prompts) >= 10:
      return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json"},
        "body": f"Max Prompts Reached"
      }
    
    difficulty, openai_response = get_openai_response()
    competition_id = str(uuid.uuid4())
    date_created = str(datetime.datetime.now().timestamp())

    table.put_item(Item={
      "competition_id": competition_id,
      "date_created": date_created,
      "difficulty": difficulty,
      "prompt": openai_response,
      "old_prompt": False,
    })
    
    return {
      "statusCode": 200,
      "headers": {"Content-Type": "application/json"},
      "body": f"Prompt: \"{openai_response}\" with competition_id: {competition_id} generated."
    }

  except Exception as e:
    return {
      "statusCode": 500,
      "headers": {"Content-Type": "application/json"},
      "body": json.dumps(str(e))
    }