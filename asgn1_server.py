import os
import io
import numpy as np
import json
import cv2
from flask import Flask, request
from PIL import Image


app = Flask(__name__)


def get_coco_values():
    # Object names, weights, configuration file
    labels_path = os.path.join(os.getcwd(), "coco.names")
    labels = open(labels_path).read().strip().split("\n")
    weights = os.path.join(os.getcwd(), "yolov3-tiny.weights")
    config = os.path.join(os.getcwd(), "yolov3-tiny.cfg")

    return labels, weights, config


def process_image(data):
    # Convert the image, bytes -> PIL image -> OpenCV image -> 4D blob
    pil_img = Image.open(io.BytesIO(data.read())).convert('RGB')
    cv_img = np.asarray(pil_img)[:, :, ::-1].copy()
    blob = cv2.dnn.blobFromImage(cv_img, 1 / 255.0, (416, 416), swapRB=True, crop=False)

    return blob


def get_detections(net, blob, names):
    # Set the input to the net
    net.setInput(blob)

    # Get the layer names and outputs
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

            # If the detection confidence is positive, add to the detections
            if confidence > 0:
                detections.append({"label": str(names[label_id]),
                                   "accuracy": str(confidence * 100)})

    # Format the result
    detections = {"objects" : detections}

    return detections


@app.route("/api/object_detection", methods=['POST'])
def object_detection():
    # Get the image as a blob to input to the network
    blob = process_image(request.files['image'])

    # Get values for the network
    names, weights, config = get_coco_values()

    # Load the network
    net = cv2.dnn.readNetFromDarknet(config, weights)

    # Get the detections
    detections = get_detections(net, blob, names)

    # Return the detections as JSON
    response = json.dumps(detections)

    return response, 200



if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, threaded=True)
