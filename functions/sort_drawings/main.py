import boto3
import json

def get_object_creation_date(bucket_name, object_key):
    s3 = boto3.client('s3')
    response = s3.head_object(Bucket=bucket_name, Key=object_key)
    return response['LastModified']

def list_s3_objects(bucket_name):
    s3 = boto3.client('s3')
    response = s3.list_objects_v2(Bucket=bucket_name)

    object_details = []

    for obj in response.get('Contents', []):
        object_key = obj['Key']
        creation_date = get_object_creation_date(bucket_name, object_key)
        object_details.append({"key": object_key, "creation_date": creation_date})

    # Sort the objects by creation date
    sorted_objects = sorted(object_details, key=lambda x: x['creation_date'])

    return sorted_objects

def sort_drawings_handler(event, context):
    bucket_name = 'doodals-bucket-seng401'
    s3_objects = list_s3_objects(bucket_name)

    print("S3 Objects:")
    for obj in s3_objects:
        print(obj['key'], obj['creation_date'])

    data = {
        "test": "test",
        "items": [{"key": obj['key'], "creation_date": obj['creation_date'].isoformat()} for obj in s3_objects]
    }

    return {
        "statusCode": 200,
        "body": json.dumps(data)
    }
