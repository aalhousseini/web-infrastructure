import os
import boto3
from boto3.dynamodb.conditions import Key
import json

dynamodb=  boto3.resource('dynamodb')
table = dynamodb.Table(os.environ['VISITOR_TABLE'])

def handler(event, context):
    body = json.loads(event["body"])
    