import json
import unittest
from moto import mock_aws
import boto3
import base64

from add_comment.main import add_comment
from create_user.main import create_user
from delete_comment.main import delete_comment
from get_comments.main import get_comments
from delete_drawing.main import delete_drawing
from upload_drawing.main import upload_drawing
from update_bio.main import update_bio
from upload_profile_photo.main import upload_profile_photo
from get_user_info_by_username.main import get_user_info_by_username
from get_user_info.main import get_user_info

class lambda_mocking_tests(unittest.TestCase):

    @mock_aws
    def test_add_comment(self):
        dynamodb = boto3.client('dynamodb', region_name='us-west-2')

        dynamodb.create_table(
            TableName='doodal-comments',
            KeySchema=[
                {
                    'AttributeName': 'username',
                    'KeyType': 'HASH'
                },
                {
                    'AttributeName': 'date_created',
                    'KeyType': 'RANGE'
                }
            ],
            AttributeDefinitions=[
                {
                    'AttributeName': 'username',
                    'AttributeType': 'S'
                },
                {
                    'AttributeName': 'date_created',
                    'AttributeType': 'S'
                }
            ],
            ProvisionedThroughput={
                'ReadCapacityUnits': 5,
                'WriteCapacityUnits': 5
            }
        )

        drawing_id = "test-drawing-id"
        comment_text = "test-comment"
        username = "test-username"
        event = {
            "body": json.dumps({"drawing_id": drawing_id, "comment_text": comment_text}),
            "headers": {"username": username}
        }

        response = add_comment(event, None)

        self.assertEqual(response['statusCode'], 200)
        self.assertIn('body', response)
        body = json.loads(response['body'])
        self.assertIn('ResponseMetadata', body)
        self.assertEqual(body['ResponseMetadata']['HTTPStatusCode'], 200)

        response = dynamodb.scan(
            TableName='doodal-comments'
        )
        
        self.assertEqual(response['Count'], 1)
        comment = response['Items'][0]
        self.assertEqual(comment['username']['S'], username)
        self.assertEqual(comment['comment_text']['S'], comment_text)
        self.assertEqual(comment['drawing_id']['S'], drawing_id)
        self.assertIsNotNone(comment['date_created']['S'])
        
    @mock_aws
    def test_create_user(self):
        # Mocking DynamoDB resources
        dynamodb = boto3.client('dynamodb', region_name='us-west-2')

        # Create mock doodal-users table
        dynamodb.create_table(
            TableName='doodal-users',
            KeySchema=[
                {
                    'AttributeName': 'username',
                    'KeyType': 'HASH'
                }
            ],
            AttributeDefinitions=[
                {
                    'AttributeName': 'username',
                    'AttributeType': 'S'
                }
            ],
            ProvisionedThroughput={
                'ReadCapacityUnits': 5,
                'WriteCapacityUnits': 5
            }
        )

        # Prepare event data
        event = {
            "request": {
                "userAttributes": {
                    "sub": "test-uuid",
                    "email": "test@example.com"
                }
            },
            "userName": "test-username"
        }

        # Execute lambda function
        response = create_user(event, None)

        # Check if item is added to the table
        response = dynamodb.scan(TableName='doodal-users')
        
        self.assertEqual(response['Count'], 1)
        user = response['Items'][0]
        self.assertEqual(user['user_id']['S'], 'test-uuid')
        self.assertEqual(user['username']['S'], 'test-username')
        self.assertEqual(user['email']['S'], 'test@example.com')
        
        
        # Ensure experience, bio, date_created, and profile_photo_url are set correctly
        self.assertIsNotNone(user['date_created']['S'])
        self.assertEqual(user['profile_photo_url']['S'], "https://doodals-bucket-seng401.s3.us-west-2.amazonaws.com/website+photos/octopus.PNG")

    @mock_aws
    def test_delete_comment(self):
        # Mocking DynamoDB resources
        dynamodb = boto3.client('dynamodb', region_name='us-west-2')

        # Create mock doodal-comments table
        dynamodb.create_table(
            TableName='doodal-comments',
            KeySchema=[
                {
                    'AttributeName': 'drawing_id',
                    'KeyType': 'HASH'
                },
                {
                    'AttributeName': 'date_created',
                    'KeyType': 'RANGE'
                }
            ],
            AttributeDefinitions=[
                {
                    'AttributeName': 'drawing_id',
                    'AttributeType': 'S'
                },
                {
                    'AttributeName': 'date_created',
                    'AttributeType': 'S'
                }
            ],
            ProvisionedThroughput={
                'ReadCapacityUnits': 5,
                'WriteCapacityUnits': 5
            }
        )

        # Prepare event data for adding a comment
        drawing_id = "test-drawing-id"
        comment_text = "test-comment"
        username = "test-username"
        add_comment_event = {
            "body": json.dumps({"drawing_id": drawing_id, "comment_text": comment_text}),
            "headers": {"username": username}
        }

        # Execute add_comment lambda function
        add_comment_response = add_comment(add_comment_event, None)

        # Assert response from add_comment
        self.assertEqual(add_comment_response["statusCode"], 200)  # Assuming successful creation returns 200 status code

        # Check if comment is added to the table
        add_comment_response = dynamodb.scan(TableName='doodal-comments')
        # print(f"add comment response: {add_comment_response['Items']}")
        # print(add_comment_response)
        date_created = add_comment_response["Items"][0]["date_created"]["S"]
        # print(f"date_created: {date_created}")
        self.assertEqual(add_comment_response['Count'], 1)  # Assuming item is added

        # Prepare event data for deleting the comment
        delete_comment_event = {
            "body": json.dumps({"drawing_id": drawing_id, "date_created": date_created}),
            "headers": {"username": username}
        }

        # Execute delete_comment lambda function
        delete_comment_response = delete_comment(delete_comment_event, None)
        # print(delete_comment_response)

        # Assert response from delete_comment
        self.assertEqual(delete_comment_response["statusCode"], 200)  # Assuming successful deletion returns 200 status code

        # Check if comment is deleted from the table
        delete_comment_response = dynamodb.scan(TableName='doodal-comments')
        self.assertEqual(delete_comment_response['Count'], 0)  # Assuming item is deleted

    @mock_aws
    def test_get_comments(self):
        # Mocking DynamoDB resources
        dynamodb = boto3.client('dynamodb', region_name='us-west-2')
        
        # Create mock doodal-users table
        dynamodb.create_table(
            TableName='doodal-users',
            KeySchema=[
                {
                    'AttributeName': 'username',
                    'KeyType': 'HASH'
                }
            ],
            AttributeDefinitions=[
                {
                    'AttributeName': 'username',
                    'AttributeType': 'S'
                }
            ],
            ProvisionedThroughput={
                'ReadCapacityUnits': 5,
                'WriteCapacityUnits': 5
            }
        )

        # Prepare event data
        events = [
            {
                "request": {
                    "userAttributes": {
                        "sub": "test-uuid1",
                        "email": "test1@example.com"
                    }
                },
                "userName": "test_username_1"
            },
            {
                "request": {
                    "userAttributes": {
                        "sub": "test-uuid2",
                        "email": "test2@example.com"
                    }
                },
                "userName": "test_username_2"
            }
        ]

        for i in range(len(events)):
            response = create_user(events[i], None)
            response = dynamodb.scan(TableName='doodal-users')
            self.assertEqual(response['Count'], i+1)
        
        dynamodb.create_table(
            TableName='doodal-comments',
            KeySchema=[
                {
                    'AttributeName': 'drawing_id',
                    'KeyType': 'HASH'
                },
                {
                    'AttributeName': 'date_created',
                    'KeyType': 'RANGE'
                }
            ],
            AttributeDefinitions=[
                {
                    'AttributeName': 'drawing_id',
                    'AttributeType': 'S'
                },
                {
                    'AttributeName': 'date_created',
                    'AttributeType': 'S'
                }
            ],
            ProvisionedThroughput={
                'ReadCapacityUnits': 5,
                'WriteCapacityUnits': 5
            }
        )


        events = [
            {
                "body": json.dumps({"drawing_id": "test_drawing_id_1", "comment_text": "test_comment_1"}),
                "headers": {"username": "test_username_1"}
            },
            {
                "body": json.dumps({"drawing_id": "test_drawing_id_1", "comment_text": "test_comment_2"}),
                "headers": {"username": "test_username_2"}
            }
        ]

        # Create multiple comments and verify their creation
        for i in range(len(events)):
            # print(f"events at {i}: {events[i]}")
            add_comment_response = add_comment(events[i], None)
            self.assertEqual(add_comment_response["statusCode"], 200)  
            add_comment_response = dynamodb.scan(TableName='doodal-comments')
            self.assertEqual(add_comment_response['Count'], i+1)
    

        # Prepare event data
        event = {
            "body": json.dumps({"drawing_id": "test_drawing_id_1"}),
            "headers": {}
        }
        
        # Execute lambda function
        response = get_comments(event, None)
        # print(f"response: {response}")

        # Assert response
        self.assertEqual(response['statusCode'], 200)
        self.assertIn('body', response)
        body = json.loads(response['body'])
        # print(body)
        self.assertEqual(len(body), 2)  # Assuming two items are returned
        
        events = [
            {
                "body": {"drawing_id": "test_drawing_id_1", "comment_text": "test_comment_1"},
                "headers": {"username": "test_username_1"}
            },
            {
                "body": {"drawing_id": "test_drawing_id_1", "comment_text": "test_comment_2"},
                "headers": {"username": "test_username_2"}
            }
        ]
        
        for i in range(2):
            self.assertIn('drawing_id', body[i])
            self.assertIn('comment_text', body[i])
            self.assertIn('username', body[i])
            self.assertEqual(body[i]['drawing_id']["S"], events[i]["body"]['drawing_id'])
            self.assertEqual(body[i]['comment_text']["S"], events[i]["body"]['comment_text'])
            self.assertEqual(body[i]['username']["S"], events[i]['headers']['username'])
 
    @mock_aws
    def test_upload_drawing(self):
        # Mocking AWS services
        s3 = boto3.client("s3", region_name="us-west-2")
        dynamodb = boto3.client("dynamodb", region_name="us-west-2")
        
        s3.create_bucket(Bucket='doodals-bucket-seng401', CreateBucketConfiguration={'LocationConstraint': 'us-west-2'})
        
        dynamodb.create_table(
            TableName='doodal-users',
            KeySchema=[
                {'AttributeName': 'username', 'KeyType': 'HASH'}
            ],
            AttributeDefinitions=[
                {'AttributeName': 'username', 'AttributeType': 'S'}
            ],
            ProvisionedThroughput={
                'ReadCapacityUnits': 5,
                'WriteCapacityUnits': 5
            }
        )

        # Prepare event data
        event = {
                "request": {
                    "userAttributes": {
                        "sub": "test-uuid1",
                        "email": "test1@example.com"
                    }
                },
                "userName": "test_username_1"
            }
        
        response = create_user(event, None)
        response = dynamodb.scan(TableName='doodal-users')
        self.assertEqual(response['Count'], 1)

        dynamodb.create_table(
            TableName="doodal-drawings",
            KeySchema=[
                {"AttributeName": "drawing_id", "KeyType": "HASH"}
            ],
            AttributeDefinitions=[
                {"AttributeName": "drawing_id", "AttributeType": "S"}
            ],
            ProvisionedThroughput={"ReadCapacityUnits": 5, "WriteCapacityUnits": 5}
        )

        dynamodb.create_table(
            TableName="doodal-comments",
            KeySchema=[
                {"AttributeName": "drawing_id", "KeyType": "HASH"},
                {"AttributeName": "date_created", "KeyType": "RANGE"}
            ],
            AttributeDefinitions=[
                {"AttributeName": "drawing_id", "AttributeType": "S"},
                {"AttributeName": "date_created", "AttributeType": "S"}
            ],
            ProvisionedThroughput={"ReadCapacityUnits": 5, "WriteCapacityUnits": 5}
        )
        
        file_path = "seng401-project-group16\mock-image.jpg"
        

        with open(file_path, 'rb') as file:
            binary_data = file.read()

        # Encode binary data using Base64
        encoded_data = base64.b64encode(binary_data)

        # Convert encoded data to a string
        encoded_string = encoded_data.decode("utf-8")

        # Prepare event data
        event = {
            "body": json.dumps({
                "competition_id": "test_competition_id",
                "image_data": encoded_string
            }),
            "headers": {"username": "test_username_1"}
        }

        # Execute lambda function
        response = upload_drawing(event, None)
        # print(response)
        drawing_id = json.loads(response["body"])["drawing_id"]
        self.assertEqual(response["statusCode"], 200)
        s3_objects = s3.list_objects(Bucket='doodals-bucket-seng401')
        # print(s3_objects)
        self.assertEqual(len(s3_objects.get('Contents', [])), 1)  # Assuming only one object is uploaded
    
        response = dynamodb.scan(TableName='doodal-drawings')
        # print(response)
        self.assertEqual(response['Count'], 1)
        
        item = response["Items"][0]
        self.assertEqual(item["drawing_id"]["S"], drawing_id)
        self.assertEqual(item["competition_id"]["S"], "test_competition_id")
        self.assertEqual(item["username"]["S"], "test_username_1")

    @mock_aws
    def test_delete_drawing(self):
        # Mocking AWS services
        s3 = boto3.client("s3", region_name="us-west-2")
        dynamodb = boto3.client("dynamodb", region_name="us-west-2")
        
        s3.create_bucket(Bucket='doodals-bucket-seng401', CreateBucketConfiguration={'LocationConstraint': 'us-west-2'})
        
        dynamodb.create_table(
            TableName='doodal-users',
            KeySchema=[
                {'AttributeName': 'username', 'KeyType': 'HASH'}
            ],
            AttributeDefinitions=[
                {'AttributeName': 'username', 'AttributeType': 'S'}
            ],
            ProvisionedThroughput={
                'ReadCapacityUnits': 5,
                'WriteCapacityUnits': 5
            }
        )

        # Prepare event data
        event = {
                "request": {
                    "userAttributes": {
                        "sub": "test-uuid1",
                        "email": "test1@example.com"
                    }
                },
                "userName": "test_username_1"
            }
        
        response = create_user(event, None)
        response = dynamodb.scan(TableName='doodal-users')
        self.assertEqual(response['Count'], 1)

        dynamodb.create_table(
            TableName="doodal-drawings",
            KeySchema=[
                {"AttributeName": "drawing_id", "KeyType": "HASH"}
            ],
            AttributeDefinitions=[
                {"AttributeName": "drawing_id", "AttributeType": "S"}
            ],
            ProvisionedThroughput={"ReadCapacityUnits": 5, "WriteCapacityUnits": 5}
        )

        dynamodb.create_table(
            TableName="doodal-comments",
            KeySchema=[
                {"AttributeName": "drawing_id", "KeyType": "HASH"},
                {"AttributeName": "date_created", "KeyType": "RANGE"}
            ],
            AttributeDefinitions=[
                {"AttributeName": "drawing_id", "AttributeType": "S"},
                {"AttributeName": "date_created", "AttributeType": "S"}
            ],
            ProvisionedThroughput={"ReadCapacityUnits": 5, "WriteCapacityUnits": 5}
        )
        
        file_path = "seng401-project-group16\mock-image.jpg"
        

        with open(file_path, 'rb') as file:
            binary_data = file.read()

        # Encode binary data using Base64
        encoded_data = base64.b64encode(binary_data)

        # Convert encoded data to a string
        encoded_string = encoded_data.decode("utf-8")

        # Prepare event data
        event = {
            "body": json.dumps({
                "competition_id": "test_competition_id",
                "image_data": encoded_string
            }),
            "headers": {"username": "test_username_1"}
        }

        # Execute lambda function
        response = upload_drawing(event, None)
        drawing_id = json.loads(response["body"])["drawing_id"]
        self.assertEqual(response["statusCode"], 200)

        # Prepare event data
        event = {
            "body": json.dumps({
                "drawing_id": drawing_id,
                "competition_id": "test_competition_id"
            }),
            "headers": {"username": "test_username_1"}
        }

        # Execute lambda function
        response = delete_drawing(event, None)

        # Assert response
        self.assertEqual(response["statusCode"], 200)
        
        s3_objects = s3.list_objects(Bucket='doodals-bucket-seng401')
        self.assertEqual(len(s3_objects.get('Contents', [])), 0)  
    
        response = dynamodb.scan(TableName='doodal-drawings')
        # print(response)
        self.assertEqual(response['Count'], 0)
    
    @mock_aws
    def test_update_bio(self):
        # Mocking AWS services
        
        dynamodb = boto3.client("dynamodb", region_name="us-west-2")
        
        
        dynamodb.create_table(
            TableName='doodal-users',
            KeySchema=[
                {'AttributeName': 'username', 'KeyType': 'HASH'}
            ],
            AttributeDefinitions=[
                {'AttributeName': 'username', 'AttributeType': 'S'}
            ],
            ProvisionedThroughput={
                'ReadCapacityUnits': 5,
                'WriteCapacityUnits': 5
            }
        )

        # Prepare event data
        event = {
                "request": {
                    "userAttributes": {
                        "sub": "test-uuid1",
                        "email": "test1@example.com"
                    }
                },
                "userName": "test_username_1"
            }
        
        response = create_user(event, None)
        response = dynamodb.scan(TableName='doodal-users')
        self.assertEqual(response['Count'], 1)
        
        event = {
                "body": json.dumps({"bio": "test_bio"}),
                "headers": {"username": "test_username_1"}
            }
        
        response = update_bio(event, None)
        
        # print(response)
        
        self.assertEqual(response["statusCode"], 200)
        self.assertEqual(response["body"]["S"], "test_bio")
        
    @mock_aws
    def test_upload_profile_photo(self):
        s3 = boto3.client("s3", region_name="us-west-2")
        dynamodb = boto3.client("dynamodb", region_name="us-west-2")
        
        s3.create_bucket(Bucket='doodals-bucket-seng401', CreateBucketConfiguration={'LocationConstraint': 'us-west-2'})

        # Create a table
        dynamodb.create_table(
            TableName='doodal-users',
            KeySchema=[{'AttributeName': 'username', 'KeyType': 'HASH'}],
            AttributeDefinitions=[{'AttributeName': 'username', 'AttributeType': 'S'}],
            ProvisionedThroughput={'ReadCapacityUnits': 5, 'WriteCapacityUnits': 5}
        )

        file_path = "seng401-project-group16\mock-image.jpg"
        
        with open(file_path, 'rb') as file:
            binary_data = file.read()

        # Encode binary data using Base64
        encoded_data = base64.b64encode(binary_data)

        # Convert encoded data to a string
        encoded_string = encoded_data.decode("utf-8")

        # Prepare event data
        event = {
            "body": json.dumps({
                "image_data": encoded_string
            }),
            "headers": {"username": "test_username_1"}
        }

        # Call the Lambda function
        response = upload_profile_photo(event, None)

        self.assertEqual(response["statusCode"], 200)
        
        s3_objects = s3.list_objects(Bucket='doodals-bucket-seng401')
        self.assertEqual(len(s3_objects.get('Contents', [])), 1)  
    
        # Check if the profile photo URL is updated in DynamoDB
        updated_item = dynamodb.get_item(
            TableName='doodal-users',
            Key={'username': {'S': 'test_username_1'}}
        )['Item']
 
        self.assertNotEqual("", updated_item["profile_photo_url"]["S"])

    @mock_aws
    def test_get_user_info_by_username(self):
        dynamodb = boto3.client('dynamodb', region_name='us-west-2')

        # Create a table
        dynamodb.create_table(
            TableName='doodal-users',
            KeySchema=[{'AttributeName': 'username', 'KeyType': 'HASH'}],
            AttributeDefinitions=[{'AttributeName': 'username', 'AttributeType': 'S'}],
            ProvisionedThroughput={'ReadCapacityUnits': 5, 'WriteCapacityUnits': 5}
        )

        event = {
                "request": {
                    "userAttributes": {
                        "sub": "test-uuid1",
                        "email": "test1@example.com"
                    }
                },
                "userName": "test_username_1"
            }
        
        response = create_user(event, None)
        response = dynamodb.scan(TableName='doodal-users')
        bio = response["Items"][0]["bio"]["S"]
        date_created = response["Items"][0]["date_created"]["S"]
        self.assertEqual(response['Count'], 1)

        # Prepare test event
        event = {"username": "test_username_1"}

        # Call the Lambda function
        response = get_user_info_by_username(event, None)
        body = json.loads(response["body"])
        # Check if the response status code is 200
        self.assertEqual(response["statusCode"], 200)
        
        # Check if the response body contains the correct user info
        expected_body = {"user_id": {"S": "test-uuid1"}, "username": {"S": "test_username_1"}, "email": {"S": "test1@example.com"}, "bio": {"S": str(bio)}, "date_created": {"S": str(date_created)}, "profile_photo_url": {"S": "https://doodals-bucket-seng401.s3.us-west-2.amazonaws.com/website+photos/octopus.PNG"}}
        self.assertEqual(body, expected_body)
    
    @mock_aws
    def test_get_user_info(self):
        dynamodb = boto3.client('dynamodb', region_name='us-west-2')

        # Create a table
        dynamodb.create_table(
            TableName='doodal-users',
            KeySchema=[{'AttributeName': 'username', 'KeyType': 'HASH'}],
            AttributeDefinitions=[{'AttributeName': 'username', 'AttributeType': 'S'}],
            ProvisionedThroughput={'ReadCapacityUnits': 5, 'WriteCapacityUnits': 5}
        )

        # Insert a sample user into the table
        event = {
                "request": {
                    "userAttributes": {
                        "sub": "test-uuid1",
                        "email": "test1@example.com"
                    }
                },
                "userName": "ruvaakaan"
            }
        
        response = create_user(event, None)
        response = dynamodb.scan(TableName='doodal-users')
        bio = response["Items"][0]["bio"]["S"]
        date_created = response["Items"][0]["date_created"]["S"]
        self.assertEqual(response['Count'], 1)

        # Prepare test event with JWT token
        event = {"headers": {"Authorization": "eyJraWQiOiJUNW1vN1ZUS21XTlRGcVY2WmF5ZVdXYnE4QXBaWEtUQnBFa2VYK0MwZk1rPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJmNmViNzQzYy02OTFmLTQxMTUtYWQ0My04ZWFiZWMxMjM4ZjgiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtd2VzdC0yLmFtYXpvbmF3cy5jb21cL3VzLXdlc3QtMl9kOUFhWjg0aHoiLCJ2ZXJzaW9uIjoyLCJjbGllbnRfaWQiOiI2YzFvZzNqdmNwNjJhcW1raGpjZ2tqa3ZncSIsImV2ZW50X2lkIjoiZGY5NWY0NzgtYjMxZC00MjYyLThiZGEtMmE4OTUyNWE2ZjdiIiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJhd3MuY29nbml0by5zaWduaW4udXNlci5hZG1pbiBwaG9uZSBvcGVuaWQgcHJvZmlsZSBlbWFpbCIsImF1dGhfdGltZSI6MTcxMDgxNTUxMywiZXhwIjoxNzEwODE5MTEzLCJpYXQiOjE3MTA4MTU1MTMsImp0aSI6IjdhN2EyZDgzLTQyMmMtNDEzOC1iYTk3LTU2NTQxZjE4YjY3NiIsInVzZXJuYW1lIjoicnV2YWFrYWFuIn0.GxzdDn-mO8O8P1eOzHg_vEHZoWKfWC42ulBHjLZHeaov1d76pJXOFM4TqEoWprlIcuJ6jYMB9TYPSaHgAoB6vWJCt9S03CoWLbESGTObQvgUYzHeCTUx6yP6FXIbNcowLp-Hfxt1DNPq6gWYVmxvOWObyPdi3TPjMeLF1AIg9iSTPiOBYU64Y_1foaGzFFn-MZGBNL9tMD7x1pA9szaAy0QvChafY69wlo2K5hZjoXFbgtdieMclMQj4GYmjrBXf9L6oPDBskXt72sEByDP59a6LkTbOuhTWG2sq316P7auBPPk7EWufKm0b2Lzie-vDSGnPn1AxDCxMO9SZxThLBg"}}

        # Call the Lambda function
        response = get_user_info(event, None)
        print(response)
        # Check if the response status code is 200
        self.assertEqual(response["statusCode"], 200)
        
        body = json.loads(response["body"])

        # Check if the response body contains the correct user info
        expected_body = {"user_id": {"S": "test-uuid1"}, "username": {"S": "ruvaakaan"}, "email": {"S": "test1@example.com"}, "bio": {"S": str(bio)}, "date_created": {"S": str(date_created)}, "profile_photo_url": {"S": "https://doodals-bucket-seng401.s3.us-west-2.amazonaws.com/website+photos/octopus.PNG"}}
        self.assertEqual(body, expected_body)
    
    
if __name__ == '__main__':
    unittest.main()
