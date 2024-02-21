import boto3
import json

dynamodb_resource = boto3.resource('dynamodb')
table = dynamodb_resource.Table('doodal-users')

def create_user(event, context):
    try:
        uuid = event["request"]["userAttributes"]["sub"]
        username = event["userName"]
        email = event["request"]["userAttributes"]["email"]
        xp = 0
        
        table.put_item(Item={
            "user_id": uuid,
            "username": username,
            "email": email,
            "experience": xp
        })
        return event
    except Exception as e:
        print(e)
        return {
            'statusCode': 500,
            'body': str(e)
        }
    

