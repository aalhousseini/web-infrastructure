import os
import boto3
from boto3.dynamodb.conditions import Key
import json

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.environ['VISITOR_TABLE'])  
def handler(event, context):
    method = event['httpMethod']
    if method == 'POST':
        table.update_item(
             Key={ 'id': 'visitor-count' },
             UpdateExpression='ADD #count :inc',
             ExpressionAttributeNames={ '#count': 'count' },
             ExpressionAttributeValues={ ':inc': 1 },
        )
        return {
            'statusCode': 200,
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
            'body': json.dumps({'count': count})
        }