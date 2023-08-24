import cv2
import numpy as np

# Constants
THRESHOLD = 0.4
SUPPRESSION_THRESHOLD = 0.3
SSD_INPUT_SIZE = 320

# Keeping track of objects
saved_object_classes = set()

# Read class labels
def construct_class_names(file_name='modules/foodIdent_module/class_names'):
    with open(file_name, 'rt') as file:
        names = file.read().rstrip('\n').split('\n')
    return names

# Show detected objects and save their classes
def show_detected_objects(img, boxes_to_keep, all_bounding_boxes, object_names, class_ids):
    for index in boxes_to_keep:
        box = all_bounding_boxes[index]
        x, y, w, h = box[0], box[1], box[2], box[3]
        class_id = int(class_ids[index])
        object_class = object_names[class_id - 1].upper()

        if object_class not in saved_object_classes:
            # Save the object class to the set
            saved_object_classes.add(object_class)

            # Save the object class to a file (e.g., detected_object_classes.txt)
            with open('detected_object_classes.txt', 'a') as f:
                f.write(object_class + '\n')

        cv2.rectangle(img, (x, y), (x + w, y + h), color=(0, 255, 0), thickness=2)
        cv2.putText(img, object_class, (box[0], box[1] - 10),
                    cv2.FONT_HERSHEY_COMPLEX_SMALL, 0.7, (0, 255, 0), 1)

# Save objects to a file
def save_detected_objects_to_file(objects, filename='modules/foodIdent_module/detected_objects.txt'):
    with open(filename, 'a') as file:
        for obj in objects:
            file.write(f"Class: {obj['class_name']}, Confidence: {obj['confidence']}, BBox: {obj['bbox']}\n")

# Main function for object detection
def foodIdent():
    class_names = construct_class_names()

    # Initialize video capture
    capture = cv2.VideoCapture('foodIdent_module/objects.mp4')

    # Load SSD model
    neural_network = cv2.dnn_DetectionModel('modules/foodIdent_module/ssd_weights.pb', 'modules/foodIdent_module/ssd_mobilenet_coco_cfg.pbtxt')
    neural_network.setPreferableBackend(cv2.dnn.DNN_BACKEND_OPENCV)
    neural_network.setPreferableTarget(cv2.dnn.DNN_TARGET_CPU)
    neural_network.setInputSize(SSD_INPUT_SIZE, SSD_INPUT_SIZE)
    neural_network.setInputScale(1.0/127.5)
    neural_network.setInputMean((127.5, 127.5, 127.5))
    neural_network.setInputSwapRB(True)

    saved_objects = set()  # Set to store saved object names

    while True:
        is_grabbed, frame = capture.read()

        if not is_grabbed:
            break

        # Detect objects using the neural network
        class_label_ids, confidences, bbox = neural_network.detect(frame)
        bbox = list(bbox)
        confidences = np.array(confidences).reshape(1, -1).tolist()[0]

        # Apply non-maximum suppression
        boxes_to_keep = cv2.dnn.NMSBoxes(bbox, confidences, THRESHOLD, SUPPRESSION_THRESHOLD)

        detected_objects = []
        for index in boxes_to_keep:
            box = bbox[index]
            x, y, w, h = box[0], box[1], box[2], box[3]
            class_id = int(class_label_ids[index])
            class_name = class_names[class_id - 1]
            confidence = confidences[index]

            if confidence > 0.7 and class_name not in saved_objects:
                detected_objects.append({
                    'class_name': class_name,
                    'confidence': confidence,
                    'bbox': (x, y, w, h)
                })

                saved_objects.add(class_name)  # Add the class_name to the set of saved objects

                cv2.rectangle(frame, (x, y), (x + w, y + h), color=(0, 255, 0), thickness=2)
                cv2.putText(frame, class_name.upper(), (x, y - 10),
                            cv2.FONT_HERSHEY_COMPLEX_SMALL, 0.7, (0, 255, 0), 1)

        save_detected_objects_to_file(detected_objects)  # Save detected objects to file

        cv2.imshow('Food Identification', frame)
        cv2.waitKey(1)

    capture.release()
    cv2.destroyAllWindows()

# if __name__ == '__main__':
#     foodIdent()
