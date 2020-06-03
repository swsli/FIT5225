
import os
import numpy as np
import json
import cv2
import boto3


s3_client = boto3.client('s3')

def get_coco_values():
    # Object names, weights, configuration file
    labels_path = s3_client.get_object(Bucket='asgn2-s3', Key='coco.names')
    labels = labels_path["Body"].read().decode('utf-8').strip().split('\n')

    config = "/tmp/config"
    if not os.path.isfile(config):
        s3_client.download_file("asgn2-s3", "yolov3.cfg", config)

    weights = "/tmp/weights"
    if not os.path.isfile(weights):
        s3_client.download_file("asgn2-s3", "yolov3.weights", weights)
    
    return labels, weights, config


def process_image(data):
    # Convert the image, numpy array -> OpenCV image -> 4D blob
    np_array = np.fromstring(data, np.uint8)
    cv_img = cv2.imdecode(np_array, cv2.IMREAD_COLOR)
    blob = cv2.dnn.blobFromImage(cv_img, 1 / 255.0, (416, 416), swapRB=True, crop=False)
    
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
            scores = detection[5:]
            label_id = np.argmax(scores)
            confidence = float(scores[label_id])
            
            # If the detection confidence is over 50%, add to the detections
            if confidence > 0.5:
                detections.append({"label": str(labels[label_id]),
                                   "accuracy": str(confidence * 100)})

    # Format the result
    detections = {"objects" : detections}
    
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
    # for record in event['Records']:
    # bucket = record['s3']['bucket']['name']
    # key = unquote_plus(record['s3']['object']['key'])

    file = s3_client.get_object(Bucket='asgn2-s3', Key='000000102258.jpg')
    content = file['Body'].read()

    response = object_detection(content)
    
    return { 'statusCode': 200, 'body': json.dumps(response) }


