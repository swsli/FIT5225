
import os
import numpy as np
import json
import cv2
import boto3
import uuid
from urllib.parse import unquote_plus


s3_client = boto3.client('s3')
s3_bucket = 'asgn2-s3'
dynamodb_client = boto3.client('dynamodb')
dynamodb_table = 'asgn2-dynamodb'

def get_coco_values():
    # Object names, weights, configuration file
    labels_path = s3_client.get_object(Bucket = s3_bucket, Key = 'coco.names')
    labels = labels_path['Body'].read().decode('utf-8').strip().split('\n')

    config = '/tmp/config'
    if not os.path.isfile(config):
        s3_client.download_file(s3_bucket, 'yolov3.cfg', config)

    weights = '/tmp/weights'
    if not os.path.isfile(weights):
        s3_client.download_file(s3_bucket, 'yolov3.weights', weights)
    
    return labels, weights, config


def process_image(data):
    # Convert the image, numpy array -> OpenCV image -> 4D blob
    np_array = np.fromstring(data, np.uint8)
    cv_img = cv2.imdecode(np_array, cv2.IMREAD_COLOR)
    blob = cv2.dnn.blobFromImage(cv_img, 1 / 255.0, (416, 416), swapRB = True, crop = False)
    
    return blob


def get_detections(net, blob, labels):
    # Set the input to the net
    net.setInput(blob)
    
    # Get the layer labels and outputs
    layer_names = net.getLayerNames()
    layer_names = [layer_names[i[0] - 1] for i in net.getUnconnectedOutLayers()]
    layer_outputs = net.forward(layer_names)
    
    # Create the detections array
    detections = []

    # For each outputs layer, get the detections and their confidences
    for output in layer_outputs:
        for detection in output:
            scores = detection[5 : ]
            label_id = np.argmax(scores)
            confidence = float(scores[label_id])
            
            # If the detection confidence is over 50%, add to the detections
            if confidence > 0.5 and str(labels[label_id]) not in detections:
                detections.append(str(labels[label_id]))
    
    return detections


def object_detection(file):
    # Get the image as a blob to input to the network
    blob = process_image(file)

    # Get values for the network
    labels, weights, config = get_coco_values()

    # Load the network
    net = cv2.dnn.readNetFromDarknet(config, weights)

    # Return the detections
    return get_detections(net, blob, labels)


def lambda_handler(event, context):
    for record in event['Records']:
        # bucket = record['s3']['bucket']['name']
        key = unquote_plus(record['s3']['object']['key'])
        file = s3_client.get_object(Bucket = s3_bucket, Key = key)
        content = file['Body'].read()
        
        detections = object_detection(content)
        
        data = {}
        data['id'] = {'S' : str(uuid.uuid4())}
        data['link'] = {'S' : 'https://' + s3_bucket + '.s3.amazonaws.com/' + key}
        data['tags'] = {'SS' : detections}
        
        response = dynamodb_client.put_item(TableName = dynamodb_table, Item = data)

