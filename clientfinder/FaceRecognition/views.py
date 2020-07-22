from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.views import APIView
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import os
from django.conf import settings
from age_gender.detect import age_gender_detection


class AgeGenderAPI(APIView):
    def get(self, request):
        try:
            file = request.FILES['photo']
            return JsonResponse({
                'status': 'Error',
                'detail': 'Use POST',
                'file_name': str(file)})
        except (KeyError, OSError) as e:
            return JsonResponse({'status': 'Error', 'detail': 'KeyError of wrong file'})

    def post(self, request):
        try:
            file = request.FILES['photo']
            path = default_storage.save(str(file), ContentFile(file.read()))
            tmp_file = os.path.join(settings.MEDIA_ROOT, path)
            detection = age_gender_detection(tmp_file)
            faces = []
            for face in detection:
                faces.append({
                    'min_age': face[0],
                    'max_age': face[1],
                    'gender': face[2]
                })
            os.remove(tmp_file)
            return JsonResponse({
                'status': 'success',
                'faces': faces
            })
        except (KeyError, OSError) as e:
            return JsonResponse({'status': 'error', 'detail': 'KeyError or wrong file'})


class DetectAPI(APIView):
    def get(self, request):
        return JsonResponse({'status': 'error', 'Detail': 'Not implemented'})

    def post(self, request):
        return JsonResponse({'status': 'error', 'Detail': 'Not implemented'})
