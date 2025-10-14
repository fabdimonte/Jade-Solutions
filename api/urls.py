# api/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SocieteViewSet

# Crée un routeur
router = DefaultRouter()
# Enregistre notre ViewSet Societe sur la route 'societes'
router.register(r'societes', SocieteViewSet)

urlpatterns = [
    path('', include(router.urls)),
]