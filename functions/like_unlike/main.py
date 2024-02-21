import boto3
import json

dynamodb_client = boto3.client("dynamodb")


def like_drawing(drawing_id, like_val):
  response = dynamodb_client.update_item(
      TableName="doodal-drawings",
      Key={
          'drawing_id': {"S": str(drawing_id)}
      },
      UpdateExpression='SET likes = likes + :val',
      ExpressionAttributeValues={":val": {"N":str(like_val)}},
      ReturnValues="UPDATED_NEW"
  )
  updated_likes = response['Attributes']['likes']
  return updated_likes



def like_unlike(event, context):
    try: 
        body = json.loads(event["body"])
        drawing_id = body["drawing_id"]
        user_id = body["user_id"]
        

        response = dynamodb_client.scan(
          TableName="doodal-likes",
          FilterExpression="user_id = :uid AND drawing_id = :did",
          ExpressionAttributeValues={
              ":uid": {"S": str(user_id)},
              ":did": {"S": str(drawing_id)}
          }
        )

        items = response.get("Items", [])
        print(items)
        
        if not items:
            
            dynamodb_client.put_item(
              TableName="doodal-likes",
              Item={
                  'user_id': {"S": str(user_id)},
                  'drawing_id': {"S": str(drawing_id)}
              }
            )
            
            updated_likes = like_drawing(drawing_id, 1)
            return {
              "statusCode": 200,
              "body": f"Drawing not previously liked, likes for drawing_id {drawing_id} incremented to {updated_likes}"
            }
        else:    
          updated_likes = like_drawing(drawing_id, -1)  
          statement = "DELETE FROM \"doodal-likes\" WHERE user_id = ? AND drawing_id = ?"
          params = [{"S": str(user_id)}, {"S": str(drawing_id)}]
          response = dynamodb_client.execute_statement(
              Statement=statement,
              Parameters=params
          )
          print(response)
          
          return {
              "statusCode": 200,
              "body": f"Unliked drawing_id {drawing_id} deincremented to {updated_likes}"
          }
    except Exception as e:
        return {
            "statusCode": 500,
            "body": f"Error: {e}"
        }
