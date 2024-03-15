import boto3
import json

s3 = boto3.client("s3")
dynamodb = boto3.client("dynamodb")

def get_users_liked(username, drawing_ids):
    users_liked_drawings = {}
    for drawing_id in drawing_ids:
        try:
            statement = "SELECT * FROM \"doodal-likes\" WHERE username = ? AND drawing_id = ?"
            params = [{"S": str(username)}, {"S": str(drawing_id)}]
            response = dynamodb.execute_statement(
                Statement=statement,
                Parameters=params
            )
            print(f"response from query: {response}")
            if response.get('Items'):
                users_liked_drawings[drawing_id] = True
            else:
                users_liked_drawings[drawing_id] = False
        except Exception as e:
            print(f"An error occurred: {e}")
    print(f"users liked drawings: {users_liked_drawings}")
    return users_liked_drawings

def get_competition_drawings(event, context):
    try:
        print(event)
        body = json.loads(event['body'])
        competition_id = body["competition_id"]
        username = event.get('headers', {}).get("username")

        statement = "SELECT * FROM \"doodal-drawings\" WHERE competition_id = ?"
        params = [{"S": str(competition_id)}]

        response = dynamodb.execute_statement(
            Statement=statement,
            Parameters=params
        )

        items = response.get("Items", [])
        drawing_ids = [item["drawing_id"]["S"] for item in items]
        print(f"drawing ids: {drawing_ids}")

        users_liked = {}
        if username:
            users_liked = get_users_liked(username, drawing_ids)

        # Update items with user likes information
        for item in items:
            drawing_id = item["drawing_id"]["S"]
            item["liked_by_user"] = users_liked.get(drawing_id, False)
        print(items)

        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS, POST, GET"
            },
            "body": json.dumps({"items": items})
        }
    except Exception as e:
        print(e)
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"error": str(e)})
        }
