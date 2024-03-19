import json
import unittest
from moto import mock_aws
import boto3
import base64
import os

from add_comment.main import add_comment
from create_user.main import create_user
from delete_comment.main import delete_comment
from get_comments.main import get_comments
from delete_drawing.main import delete_drawing
from upload_drawing.main import upload_drawing

class lambda_mocking_tests(unittest.TestCase):

    @mock_aws
    def test_add_comment(self):
        # Mocking DynamoDB resources
        dynamodb = boto3.client('dynamodb', region_name='us-west-2')

        # Create mock doodal-comments table
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

        # Prepare event data
        drawing_id = "test-drawing-id"
        comment_text = "test-comment"
        username = "test-username"
        event = {
            "body": json.dumps({"drawing_id": drawing_id, "comment_text": comment_text}),
            "headers": {"username": username}
        }

        # Execute lambda function
        response = add_comment(event, None)
        # print(response)

        # Assert response
        self.assertEqual(response['statusCode'], 200)
        self.assertIn('body', response)
        body = json.loads(response['body'])
        self.assertIn('ResponseMetadata', body)
        self.assertEqual(body['ResponseMetadata']['HTTPStatusCode'], 200)

        # Check if item is added to the table
        response = dynamodb.scan(
            TableName='doodal-comments'
        )
        # print(response)
        self.assertEqual(response['Count'], 1)
        comment = response['Items'][0]
        self.assertEqual(comment['username']['S'], username)
        self.assertEqual(comment['comment_text']['S'], comment_text)
        self.assertEqual(comment['drawing_id']['S'], drawing_id)
        # Ensure date_created is not empty
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
                    'AttributeName': 'user_id',
                    'KeyType': 'HASH'
                }
            ],
            AttributeDefinitions=[
                {
                    'AttributeName': 'user_id',
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
        self.assertEqual(user['experience']['N'], '0')
        self.assertEqual(user['bio']['S'], 'Create a bio!')
        self.assertIsNotNone(user['date_created']['S'])
        self.assertEqual(user['profile_photo_url']['S'], '')

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
                    'AttributeName': 'user_id',
                    'KeyType': 'HASH'
                }
            ],
            AttributeDefinitions=[
                {
                    'AttributeName': 'user_id',
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

    # @mock_aws
    # def test_delete_drawing(self):
    #     # Mocking AWS services
    #     s3 = boto3.client("s3", region_name="us-west-2")
    #     dynamodb = boto3.client("dynamodb", region_name="us-west-2")
        
    #     dynamodb.create_table(
    #         TableName='doodal-users',
    #         KeySchema=[
    #             {'AttributeName': 'user_id', 'KeyType': 'HASH'}
    #         ],
    #         AttributeDefinitions=[
    #             {'AttributeName': 'user_id', 'AttributeType': 'S'}
    #         ],
    #         ProvisionedThroughput={
    #             'ReadCapacityUnits': 5,
    #             'WriteCapacityUnits': 5
    #         }
    #     )

    #     # Prepare event data
    #     event = {
    #             "request": {
    #                 "userAttributes": {
    #                     "sub": "test-uuid1",
    #                     "email": "test1@example.com"
    #                 }
    #             },
    #             "userName": "test_username_1"
    #         }
        
    #     response = create_user(event, None)
    #     response = dynamodb.scan(TableName='doodal-users')
    #     self.assertEqual(response['Count'], 1)

    #     dynamodb.create_table(
    #         TableName="doodal-drawings",
    #         KeySchema=[
    #             {"AttributeName": "drawing_id", "KeyType": "HASH"}
    #         ],
    #         AttributeDefinitions=[
    #             {"AttributeName": "drawing_id", "AttributeType": "S"}
    #         ],
    #         ProvisionedThroughput={"ReadCapacityUnits": 5, "WriteCapacityUnits": 5}
    #     )

    #     dynamodb.create_table(
    #         TableName="doodal-comments",
    #         KeySchema=[
    #             {"AttributeName": "drawing_id", "KeyType": "HASH"},
    #             {"AttributeName": "date_created", "KeyType": "RANGE"}
    #         ],
    #         AttributeDefinitions=[
    #             {"AttributeName": "drawing_id", "AttributeType": "S"},
    #             {"AttributeName": "date_created", "AttributeType": "S"}
    #         ],
    #         ProvisionedThroughput={"ReadCapacityUnits": 5, "WriteCapacityUnits": 5}
    #     )

    #     # Prepare event data
    #     event = {
    #         "body": json.dumps({
    #             "drawing_id": "test_drawing_id",
    #             "competition_id": "test_competition_id"
    #         }),
    #         "headers": {"username": "test_username_1"}
    #     }

    #     # Execute lambda function
    #     response = delete_drawing(event, None)

    #     # Assert response
    #     self.assertEqual(response["statusCode"], 200)
 
    @mock_aws
    def test_upload_drawing(self):
        # Mocking AWS services
        s3 = boto3.client("s3", region_name="us-west-2")
        dynamodb = boto3.client("dynamodb", region_name="us-west-2")
        
        s3.create_bucket(Bucket='doodals-bucket-seng401', CreateBucketConfiguration={'LocationConstraint': 'us-west-2'})
        
        dynamodb.create_table(
            TableName='doodal-users',
            KeySchema=[
                {'AttributeName': 'user_id', 'KeyType': 'HASH'}
            ],
            AttributeDefinitions=[
                {'AttributeName': 'user_id', 'AttributeType': 'S'}
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
                "image-data": encoded_string
            }),
            "headers": {"username": "test_username_1"}
        }

        # Execute lambda function
        response = upload_drawing(event, None)
        print(response)
        self.assertEqual(response["statusCode"], 200)
        

    
if __name__ == '__main__':
    unittest.main()
