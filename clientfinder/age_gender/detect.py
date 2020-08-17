import os
import cv2
import math
from django.conf import settings
import numpy
from FaceRecognition.classes import Face
from PIL import Image

path_wrapper = os.path.join(settings.BASE_DIR, 'age_gender')


def age_gender_detection(file_path, width_coeff=1, height_coeff=1, horizontal_offset=0, vertical_offset=0):
    faceProto = os.path.join(path_wrapper, 'opencv_face_detector.pbtxt')
    faceModel = os.path.join(path_wrapper, 'opencv_face_detector_uint8.pb')
    ageProto = os.path.join(path_wrapper, 'age_deploy.prototxt')
    ageModel = os.path.join(path_wrapper, 'age_net.caffemodel')
    genderProto = os.path.join(path_wrapper, 'gender_deploy.prototxt')
    genderModel = os.path.join(path_wrapper, 'gender_net.caffemodel')

    MODEL_MEAN_VALUES = (78.4263377603, 87.7689143744, 114.895847746)
    ageList = ['(0-2)', '(4-6)', '(8-12)', '(15-20)', '(25-32)', '(38-43)', '(48-53)', '(60-100)']
    genderList = ['Male', 'Female']

    faceNet = cv2.dnn.readNet(faceModel, faceProto)
    faceNet.setPreferableBackend(cv2.dnn.DNN_BACKEND_CUDA)
    faceNet.setPreferableTarget(cv2.dnn.DNN_TARGET_CUDA)

    ageNet = cv2.dnn.readNet(ageModel, ageProto)
    ageNet.setPreferableBackend(cv2.dnn.DNN_BACKEND_CUDA)
    ageNet.setPreferableTarget(cv2.dnn.DNN_TARGET_CUDA)

    genderNet = cv2.dnn.readNet(genderModel, genderProto)
    genderNet.setPreferableBackend(cv2.dnn.DNN_BACKEND_CUDA)
    genderNet.setPreferableTarget(cv2.dnn.DNN_TARGET_CUDA)

    frame = cropImage(file_path, width_coeff, height_coeff, horizontal_offset, vertical_offset)

    padding = 20

    result = []

    faceBoxes = highlightFace(faceNet, frame)
    if not faceBoxes:
        print("No face detected")
    for faceBox in faceBoxes:
        face = frame[max(0, faceBox[1] - padding):
                     min(faceBox[3] + padding, frame.shape[0] - 1), max(0, faceBox[0] - padding)
                                                                    :min(faceBox[2] + padding, frame.shape[1] - 1)]
        blob = cv2.dnn.blobFromImage(face, 1.0, (227, 227), MODEL_MEAN_VALUES, swapRB=False)
        genderNet.setInput(blob)
        genderPreds = genderNet.forward()
        gender = genderList[genderPreds[0].argmax()]
        ageNet.setInput(blob)
        agePreds = ageNet.forward()
        age = ageList[agePreds[0].argmax()]
        face = Face()
        face.min_age = int(age[1:-1].split('-')[0])
        face.max_age = int(age[1:-1].split('-')[1])
        face.gender = gender
        result.append(face)
    return result

def highlightFace(net, frame, conf_threshold=0.7):
    frameOpencvDnn = frame.copy()
    frameHeight = frameOpencvDnn.shape[0]
    frameWidth = frameOpencvDnn.shape[1]
    blob = cv2.dnn.blobFromImage(frameOpencvDnn, 1.0, (300, 300), [104, 117, 123], True, False)

    net.setInput(blob)
    detections = net.forward()
    faceBoxes = []
    for i in range(detections.shape[2]):
        confidence = detections[0, 0, i, 2]
        if confidence > conf_threshold:
            x1 = int(detections[0, 0, i, 3] * frameWidth)
            y1 = int(detections[0, 0, i, 4] * frameHeight)
            x2 = int(detections[0, 0, i, 5] * frameWidth)
            y2 = int(detections[0, 0, i, 6] * frameHeight)
            faceBoxes.append([x1, y1, x2, y2])
    return faceBoxes


def cropImage(file_path, width_coeff, height_coeff, horizontal_offset, vertical_offset):
    img = Image.open(file_path)
    width, height = img.size
    return numpy.array(img.crop(((width * (1 - width_coeff)) // 2 + horizontal_offset,
             (height * (1 - height_coeff)) // 2 - vertical_offset,
             (width * (1 + width_coeff)) // 2 + horizontal_offset,
             (height * (1 + height_coeff)) // 2 - vertical_offset)))

#age_gender_detection(os.path.join(path_wrapper, 'test2.jpeg'), 0.25, 0.33, 50, 50)