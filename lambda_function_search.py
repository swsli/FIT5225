import json
import boto3


def searchImageByTag(tags, dynamodb=None):
    if not dynamodb:
        dynamodb = boto3.resource("dynamodb")
    table = dynamodb.Table("fit5225dynamodb")

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
        ProjectionExpression= "link",
        FilterExpression= filterExpression,
        ExpressionAttributeValues= expressionAttrVal)
    print(filterExpression)
    print(expressionAttrVal)
    print("Response:")
    print(response)
    result = []
    items = response['Items']

    for i in items:
        result.append(i['link'])
    return {"links": result}



def lambda_handler(event, context):
    # TODO implement
    tags = event['queryStringParameters']
    tagValue = []
    for tag in tags:
        tagValue.append(tags[tag])



    return {
        'statusCode': 200,
        'headers': {
            "Access-Control-Allow-Origin" : "*",
            "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, x-amz-security-token, authorization,  x-amz-date"
        },
        'body': json.dumps(searchImageByTag(tagValue))
    }