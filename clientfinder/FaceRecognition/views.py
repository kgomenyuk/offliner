from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.views import APIView
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import os
from django.conf import settings


def age_gender_detection(file_path):  # временная заглушка
    min_age = 0
    max_age = 100
    gender = 'Male'
    return min_age, max_age, gender


class ImageAPI(APIView):
    def get(self, request):
        try:
            file = request.FILES['photo']
            return JsonResponse({
                'status': 'Error',
                'detail': 'Use POST',
                'file_name': str(file)})
        except (KeyError, OSError) as e:
            return JsonResponse({'Status': 'Error', 'Detail': 'KeyError of wrong file'})

    def post(self, request):
        try:
            file = request.FILES['photo']
            path = default_storage.save(str(file), ContentFile(file.read()))
            tmp_file = os.path.join(settings.MEDIA_ROOT, path)
            min_age, max_age, gender = age_gender_detection(tmp_file)
            return JsonResponse({
                'status': 'success',
                'min_age': min_age,
                'max_age': max_age,
                'gender': gender
            })
        except (KeyError, OSError) as e:
            return JsonResponse({'Status': 'Error', 'Detail': 'KeyError or wrong file'})
