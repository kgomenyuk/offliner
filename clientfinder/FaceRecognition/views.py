from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.views import APIView
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import os
from django.conf import settings


class ImageAPI(APIView):
    def get(self, request):
        file = request.FILES['photo']
        return JsonResponse({'Status': 'Error', 'Detail': 'Use POST', 'File name': str(file)})

    def post(self, request):
        file = request.FILES['photo']
        path = default_storage.save(str(file), ContentFile(file.read()))
        tmp_file = os.path.join(settings.MEDIA_ROOT, path)
        return JsonResponse({'Status': 'success', 'Image name': str(file)})
