import boto3
import json

dynamodb = boto3.client("dynamodb")

def get_users_pfp(username):
    try:
        print(f"username: {username}")
        statement = "SELECT * FROM \"doodal-users\" WHERE username = ?"
        params = [{"S": str(username)}]
        response = dynamodb.execute_statement(
            Statement=statement,
            Parameters=params
        )
        print(f"response from query: {response}")
        item = response["Items"]
        return item[0]["profile_photo_url"]["S"]
    except Exception as e:
        print(f"An error occurred: {e}")
        return False

def get_comments(event, context):
  try:
    print(event)
    body = json.loads(event["body"])
    drawing_id = body["drawing_id"]

    statement = "SELECT * FROM \"doodal-comments\" WHERE drawing_id = ?"
    params = [{"S": str(drawing_id)}]

    response = dynamodb.execute_statement(
      Statement=statement,
      Parameters=params
    )
    print("response:", response)

    for item in response["Items"]:
      item["profile_photo"] = get_users_pfp(item["username"]["S"])

    return {
      "statusCode": 200,
      "headers": {"Content-Type": "application/json",
                  "Access-Control-Allow-Headers" : "Content-Type",
                  "Access-Control-Allow-Origin": "*",
                  "Access-Control-Allow-Methods" : "OPTIONS, POST, GET"
      },
      "body": json.dumps(response["Items"])
    }
  except Exception as e:
    return {
      "statusCode": 500,
      "headers": {"Content-Type": "application/json",
                  "Access-Control-Allow-Headers" : "Content-Type",
                  "Access-Control-Allow-Origin": "*",
                  "Access-Control-Allow-Methods" : "OPTIONS, POST, GET"
      },
      "body": json.dumps({"error": str(e)})
    }