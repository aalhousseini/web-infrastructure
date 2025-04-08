import os
import boto3
import json
import uuid  # For generating a unique ID

# Set up DynamoDB resource and table
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.environ['PROJECTS_TABLE'])

def handler(event, context):
    method = event['httpMethod']

    if method == 'POST':
        try:
            body = json.loads(event["body"])

            # Extract fields from request body
            title = body.get("title")
            description = body.get("description")
            longDescription = body.get("longDescription")
            technologies = body.get("technologies", [])
            liveLink = body.get("liveLink", "")
            githubLink = body.get("githubLink", "")
            isActive = body.get("isActive", True)

            # Put item into DynamoDB
            table.put_item(
                Item={
                    "id": str(uuid.uuid4()),  # Generate a unique ID
                    "title": title,
                    "description": description,
                    "longDescription": longDescription,
                    "technologies": technologies,
                    "liveLink": liveLink,
                    "githubLink": githubLink,
                    "isActive": isActive
                }
            )

            return {
                'statusCode': 201,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                'body': json.dumps({'message': 'Project created successfully'})
            }

        except Exception as e:
            print("Error:", e)
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                'body': json.dumps({'error': str(e)})
            }

    elif method == 'GET':
        try:
            result = table.scan()
            items = result.get("Items", [])

            responseBody = []
            for item in items:
                responseBody.append({
                    "id": item.get("id"),
                    "title": item.get("title"),
                    "description": item.get("description"),
                    "longDescription": item.get("longDescription"),
                    "technologies": item.get("technologies", []),
                    "githubLink": item.get("githubLink"),
                    "liveLink": item.get("liveLink"),
                    "isActive": item.get("isActive", True),
                })

            return {
                "statusCode": 200,
                "headers": {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                "body": json.dumps(responseBody)
            }

        except Exception as e:
            print("Error:", e)
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                'body': json.dumps({'error': str(e)})
            }

    else:
        return {
            "statusCode": 405,
            "headers": {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            "body": json.dumps({"error": f"Method {method} not allowed"})
        }
