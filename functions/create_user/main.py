import boto3
import json

dynamodb_resource = boto3.resource('dynamodb')
table = dynamodb_resource.Table('doodal-users')

def create_user(event, context):
    user_data = json.loads(event['body'])
    
    required_fields = ['UserID', 'username', 'password', 'xp', 'email', 'date_created']
    for field in required_fields:
        if field not in user_data:
            return {
                'statusCode': 400,
                'body': f'Missing required field: {field}'
            }
    
    try:
        table.put_item(Item=user_data)
    except Exception as e:
        return {
            'statusCode': 500,
            'body': str(e)
        }
    
    return {
        'statusCode': 200,
        'body': 'User created successfully'
    }
