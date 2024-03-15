import boto3
import json
import random

dynamodb_resource = boto3.client("dynamodb")
table_name = "doodal-drawings"

def randomize(data):
    return random.sample(data, len(data))

def likes_ascend(data):
    return sorted(data, key=lambda x: x.get('likes', 0))

def likes_descend(data):
    return sorted(data, key=lambda x: x.get('likes', 0), reverse=True)

def date_ascend(data):
    return sorted(data, key=lambda x: x.get('date_created', ''))

def date_descend(data):
    return sorted(data, key=lambda x: x.get('date_created', ''), reverse=True)

def sort_drawings_handler(event, context):
    """
    Lambda function to handle sorting and retrieving drawings from a DynamoDB table

    Parameters:
    - sort_type (str): Specifies the sorting criteria for the drawing list
        - "random": Randomizes the drawing list
        - "likes-ascend": Sorts the drawing list from least liked to most liked
        - "likes-descend": Sorts the drawing list from most liked to least liked
        - "date-ascend": Sorts the drawing list from oldest to newest
        - "date-descend": Sorts the drawing list from newest to oldest
        - Defaults to random
        - Invalid input defaults to random
    - competition_type (str): Specifies the competition for the drawing list
        - Defaults to all
        - Invalid input defaults to empty list
    - amount (int): Specifies the number of elements in the drawing list
        - Defaults to all
        - Invalid input defaults to all   

    Example:
    "body": {
        "sort_type": "",
        "competition_type": "",
        "amount": 1
    }

    Returns:
    - dict: JSON response with a sorted drawing array
    """
    try:
        print(event)

        if "body" not in event:
            raise ValueError("Missing 'body' key in the request")

        body = json.loads(event["body"])
        competition_by = body["competition_type"]
        sort_by = body["sort_type"]
        amount = body["amount"]
       
        print(sort_by)
        print(competition_by)

        response = dynamodb_resource.scan(TableName=table_name)

        items = response.get('Items', [])

        print(response)

        data = []

        for item in items:
            drawing_id = item.get('drawing_id', {}).get('S', '')
            competition_id = item.get('competition_id', {}).get('S', '')
            date_created = float(item.get('date_created', {}).get('S', ''))
            likes = int(item.get('likes', {}).get('N', 0))
            s3_url = item.get('s3_url', {}).get('S', '')
            user_id = item.get('user_id', {}).get('S', '')
            username = item.get('username', {}).get('S', '')

            item_dict = {
                'drawing_id': drawing_id,
                'competition_id': competition_id,
                'date_created': date_created,
                'likes': likes,
                's3_url': s3_url,
                'user_id': user_id,
                'username': username
            }

            data.append(item_dict)

        print(data)

        if competition_by != "":
            data = [item for item in data if item['competition_id'] == competition_by]

        print(data)

        if sort_by == "random":
            data = randomize(data)
        elif sort_by == "likes-ascend":
            data = likes_ascend(data)
        elif sort_by == "likes-descend":
            data = likes_descend(data)
        elif sort_by == "date-ascend":
            data = date_ascend(data)
        elif sort_by == "date-descend":
            data = date_descend(data)
        else:
            data = randomize(data)

        print(data)

        if isinstance(amount, int) and amount >= 0:
            data = data[:amount]

        print(data)

        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json",
                  "Access-Control-Allow-Headers" : "Content-Type",
                  "Access-Control-Allow-Origin": "*",
                  "Access-Control-Allow-Methods" : "OPTIONS, POST, GET"},
            "body": json.dumps(data)
        }
    except ValueError as ve:
        # Handle the specific error for a missing body
        print(f"ValueError: {ve}")
        return {
            "statusCode": 400,
            "headers": {"Content-Type": "application/json",
                  "Access-Control-Allow-Headers" : "Content-Type",
                  "Access-Control-Allow-Origin": "*",
                  "Access-Control-Allow-Methods" : "OPTIONS, POST, GET"},
            "body": json.dumps({"error": ve})
        }
    except Exception as e:
        # Handle unexpected errors
        print(f"An error occurred: {e}")
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json",
                  "Access-Control-Allow-Headers" : "Content-Type",
                  "Access-Control-Allow-Origin": "*",
                  "Access-Control-Allow-Methods" : "OPTIONS, POST, GET"},
            "body": json.dumps({"error": e})
        }
