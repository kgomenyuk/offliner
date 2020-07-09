from django.shortcuts import render, redirect
from .forms import ImageForm


def index(request):
    if request.method == 'POST':
        form = ImageForm(request.POST, files=request.FILES or None)

        if form.is_valid():
            image = form.save(commit=False)
            image.save()
            return redirect('index')
        return render(request, 'index.html', {'form': form})
    form = ImageForm(files=request.FILES or None)
    return render(request, 'index.html', {'form': form})
# Create your views here.
