import boto3
import json

s3 = boto3.client("s3")
dynamodb = boto3.client("dynamodb")

def verify_user(requested,draw_id):
  try:
    statement = "SELECT * FROM \"doodal-drawings\" WHERE drawing_id = ?"
    params = [{"S": str(draw_id)}]
    response = dynamodb.execute_statement(
      Statement=statement,
      Parameters=params
    )
    items = response["Items"]
    print(items)
    print(items[0]["username"]["S"])
    if items[0]["username"]["S"] == requested:
      return True
    else:
      return False
  except Exception as e:
    print(e)
    return False

def delete_drawing(event, context):
  try:
    print(event)
    body = json.loads(event["body"])
    username = event['headers']["username"]
    drawing_id = body["drawing_id"]
    competition_id = body["competition_id"]

    res = verify_user(username,drawing_id)

    if not res:
      return {
      "statusCode": 401,
      "headers": {"Content-Type": "application/json",
          "Access-Control-Allow-Headers" : "Content-Type",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods" : "OPTIONS, POST, GET"
      },
      "body": "Unauthorized user tried to delete post."
    }

    scan_response = dynamodb.scan(
        TableName="doodal-comments",
        FilterExpression="drawing_id = :val",  # Assuming "drawing_id" is the attribute name
        ExpressionAttributeValues={':val': {'S': drawing_id}}
    )

    for item in scan_response['Items']:
      print(item)
      delete_response = dynamodb.delete_item(
          TableName="doodal-comments",
          Key={
              'drawing_id': item['drawing_id'],
              'date_created': item['date_created']  # Use retrieved sort key
          }
      )

    response = dynamodb.delete_item(
      TableName="doodal-drawings",
      Key={
          'drawing_id': {'S': drawing_id}
        }
      )

    bucket_name = 'doodals-bucket-seng401'
    key = f'{competition_id}/{drawing_id}.jpg'
    s3.delete_object(Bucket=bucket_name, Key=key)

    return {
      "statusCode": 200,
      "headers": {"Content-Type": "application/json",
          "Access-Control-Allow-Headers" : "Content-Type",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods" : "OPTIONS, POST, GET"
      },
      "body": "Post was successfully deleted."
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
