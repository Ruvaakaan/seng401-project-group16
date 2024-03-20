import json
import boto3

dynamodb = boto3.client("dynamodb")

def get_user_info_by_username(event, context):
    try:
        # print("event:", event)
        # Extract username from the event
        username = event.get("username")
        if not username:
            return {
                "statusCode": 400,
                "body": "Username is missing in the request"
            }
        # print("Username:", username)
        
        # Construct the PartiQL query statement
        statement = "SELECT * FROM \"doodal-users\" WHERE username = ?"
        params = [{"S": str(username)}]

        # Execute the PartiQL query
        response = dynamodb.execute_statement(
            Statement=statement,
            Parameters=params
        )
        # print("response:", response)
        
        items = response.get("Items", [])
        if not items:
            return {
                "statusCode": 404,
                "body": "User not found"
            }
        
        user_info = items[0]
        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS, POST, GET"
            },
            "body": json.dumps(user_info)
        }
        
    except Exception as e:
        return {
            "statusCode": 500,
            "body":  json.dumps(str(e))
        }
