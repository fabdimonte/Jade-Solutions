# api/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
# Assurez-vous d'importer les DEUX viewsets
from .views import SocieteViewSet, ContactViewSet

router = DefaultRouter()
router.register(r'societes', SocieteViewSet)
router.register(r'contacts', ContactViewSet) # <--- AJOUTEZ CETTE LIGNE

urlpatterns = [
    path('', include(router.urls)),
]