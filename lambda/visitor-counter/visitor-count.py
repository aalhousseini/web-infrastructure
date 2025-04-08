import os
import boto3
from boto3.dynamodb.conditions import Key
import json

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.environ['VISITOR_TABLE'])

def handler(event, context):
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': '*',
    }

    method = event['httpMethod']

    # ✅ CORS preflight handling
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps('CORS preflight passed')
        }

    if method == 'POST':
        table.update_item(
            Key={ 'id': 'visitor-count' },
            UpdateExpression='ADD #count :inc',
            ExpressionAttributeNames={ '#count': 'count' },
            ExpressionAttributeValues={ ':inc': 1 },
        )
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps('Visitor count incremented')
        }

    elif method == 'GET':
        response = table.get_item(
            Key={ 'id': 'visitor-count' },
            ProjectionExpression='count'
        )
        count = response.get('Item', {}).get('count', 0)
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({'count': count})
        }

    # Optionally return method not allowed
    return {
        'statusCode': 405,
        'headers': headers,
        'body': json.dumps({'error': 'Method Not Allowed'})
    }
