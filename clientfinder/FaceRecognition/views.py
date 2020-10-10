from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.views import APIView
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import os
from django.conf import settings
from age_gender.detect import age_gender_detection
from FaceRecognition.classes import AgeGenderResponse, DetectResponse, MarkResponse
from db.uniqueUsers import uniqueGuests
import time


class AgeGenderAPI(APIView):
    def get(self, request):
        json_response = AgeGenderResponse()
        json_response.status = 'error'
        json_response.detail = 'Use POST'
        return JsonResponse(json_response.json())

    def post(self, request):
        start_time = time.time()
        tmp_file = ''
        try:
            file = request.FILES['photo']
            path = default_storage.save(str(file), ContentFile(file.read()))
            tmp_file = os.path.join(settings.MEDIA_ROOT, path)
            detection = age_gender_detection(tmp_file)
            json_response = AgeGenderResponse()
            json_response.status = 'success'
            json_response.faces = detection
            os.remove(tmp_file)
            # logging
            detection_time = (time.time() - start_time)
            with open('logs/age_gender.log', 'a') as log:
                log.write(
                    time.strftime('%Y-%m-%d %H:%M:%S', time.localtime()) + ' '
                    + str(file) + ' {:.2f} s.\n'.format(detection_time)
                )
            return JsonResponse(json_response.json())
        except (KeyError, OSError, AttributeError) as e:
            if tmp_file != '':
                os.remove(tmp_file)
            json_response = AgeGenderResponse()
            json_response.status = 'error'
            json_response.detail = str(e)
            return JsonResponse(json_response.json())


class DetectAPI(APIView):
    def get(self, request):
        json_response = DetectResponse()
        json_response.status = 'error'
        json_response.detail = 'Not implemented'
        return JsonResponse(json_response.json())

    def post(self, request):
        json_response = DetectResponse()
        json_response.status = 'error'
        json_response.detail = 'Not implemented'
        return JsonResponse(json_response.json())


class MarkAPI(APIView):
    def get(self, request):
        start = request.GET['start']
        end = request.GET['end']
        json_response = uniqueGuests(start, end)
        json_response.status = 'success'
        return JsonResponse(json_response.json())
