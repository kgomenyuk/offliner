from django.forms import ModelForm

from .models import Recognition


class ImageForm(ModelForm):
    class Meta:
        model = Recognition
        fields = ('photo',)

