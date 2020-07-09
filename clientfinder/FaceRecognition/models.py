from django.db import models


class Recognition(models.Model):
    photo = models.ImageField(null=True, blank=True, upload_to='images/')
