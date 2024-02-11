import json
import boto3
from botocore.exceptions import ClientError

# https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/example_dynamodb_Scenario_PartiQLSingle_section.html
# Create a DynamoDB resource
dynamodb_resource = boto3.client('dynamodb')

def get_user_info(event, context):
    try:
        # Parse the JSON string in the 'body' field
        body = json.loads(event['body'])
        user_id = body['user_id']
        
        # make sure you use \"<table-name>\ or the query statement won't work" 
        statement = "SELECT * FROM \"doodal-users\" WHERE UserID = ?"
        params = [{"S": str(user_id)}]
        response = dynamodb_resource.execute_statement(
            Statement=statement,
            Parameters=params
        )
        print(response)

        # Handle the response
        items = response.get('Items', [])
        if not items:
            return {
                'statusCode': 404,
                'body': 'User not found'
            }
        
        user_info = items[0]
        return {
            'statusCode': 200,
            'body': json.dumps(user_info)
        }
        
    except KeyError:
        return {
            'statusCode': 400,
            'body': 'User ID is missing in the request body'
        }
    except ClientError as e:
        return {
            'statusCode': 500,
            'body': f'Error executing PartiQL statement: {str(e)}'
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': str(e)
        }
