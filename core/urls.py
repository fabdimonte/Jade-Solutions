# core/urls.py
from django.contrib import admin
from django.urls import path, include # Assure-toi que 'include' est importé

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')), # Ajoute cette ligne
]