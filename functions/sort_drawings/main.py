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
    - Empty body or other sort type defaults to random

    Example:
    {
        "sort_type": "random"
    }

    API Gateway Example:
    - Query strings
        - sort_type=likes-ascend

    Returns:
    - dict: JSON response with a sorted drawing array
    """
    try:
        print(event)
        print(type(event))
        sort_by = "random"
    
        if "sort_type" in event:
            sort_by = event.get("sort_type", "random")
        else:
            if "body" not in event:
                raise ValueError("Missing 'body' key in the request")

            body = json.loads(event["body"])
            sort_by = body.get("sort_type", "random")

        print(sort_by)

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

            item_dict = {
                'drawing_id': drawing_id,
                'competition_id': competition_id,
                'date_created': date_created,
                'likes': likes,
                's3_url': s3_url,
                'user_id': user_id
            }

            data.append(item_dict)

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

        return {
            "statusCode": 200,
            "body": json.dumps(data)
        }
    except ValueError as ve:
        # Handle the specific error for a missing body
        print(f"ValueError: {ve}")
        return {
            "statusCode": 400,
            "body": json.dumps({"error": "Missing Request Body"})
        }
    except Exception as e:
        # Handle unexpected errors
        print(f"An error occurred: {e}")
        return {
            "statusCode": 500,
            "body": json.dumps({"error": "Internal Server Error"})
        }
