import json
import boto3


def searchImageByTag(tags, dynamodb=None):
    if not dynamodb:
        dynamodb = boto3.resource("dynamodb")
    table = dynamodb.Table("asgn2-dynamodb")
    
    j = 1
    filterExpression = ""
    expressionAttrVal = {}
    for i in tags:
        if j == 1:
            filterExpression = "contains(tags, :tag"+str(j)+")"
        else:
            filterExpression = filterExpression + " AND " + "contains(tags, :tag"+str(j)+")"
        expressionAttrVal[':tag'+ str(j)] = i
        j += 1
    
    response = table.scan(
        ProjectionExpression= "imageUrl",
        FilterExpression= filterExpression,
        ExpressionAttributeValues= expressionAttrVal)
  
    
    result = []
    items = response['Items']
    
    for i in items:
        result.append(i['imageUrl'])
    return {"links": result}
    


def lambda_handler(event, context):
    # TODO implement
    tags = []
    tags = json.loads(event['body'])['Tags']
    

    return {
        'statusCode': 200,
        'body': json.dumps(searchImageByTag(tags))
    }

