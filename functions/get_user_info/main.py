import json
import boto3
import jwt
from botocore.exceptions import ClientError

# https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/example_dynamodb_Scenario_PartiQLSingle_section.html
dynamodb_resource = boto3.client("dynamodb")

def get_user_info(event, context):
    try:
        print("event:", event)
        print("applebanana")
        
        # Decode the JWT token from the event
        token = event.get("token")
        if not token:
            return {
                "statusCode": 400,
                "body": "JWT token is missing in the request"
            }
        
        decoded_token = jwt.decode(token, algorithms=["RS256"], verify=False)  # Decode the token
        
        print("Decoded token:", decoded_token)
        
        # Extract user ID from the decoded token
        user_id = decoded_token.get("sub")
        if not user_id:
            return {
                "statusCode": 400,
                "body": "User ID is missing in the JWT token"
            }

        # Construct the PartiQL query statement
        statement = "SELECT * FROM \"doodal-users\" WHERE user_id = ?"
        params = [{"S": str(user_id)}]

        # Execute the PartiQL query
        response = dynamodb_resource.execute_statement(
            Statement=statement,
            Parameters=params
        )
        print("response:", response)
        
        items = response.get("Items", [])
        if not items:
            return {
                "statusCode": 404,
                "body": "User not found"
            }
        
        user_info = items[0]
        return {
            "statusCode": 200,
            "body": json.dumps(user_info)
        }
        
    except jwt.ExpiredSignatureError:
        return {
            "statusCode": 401,
            "body": "JWT token has expired"
        }
    except jwt.InvalidTokenError:
        return {
            "statusCode": 401,
            "body": "Invalid JWT token"
        }
    except KeyError:
        return {
            "statusCode": 400,
            "body": "User ID is missing in the request body"
        }
    except ClientError as e:
        return {
            "statusCode": 500,
            "body": f"Error executing PartiQL statement: {str(e)}"
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "body": str(e)
        }