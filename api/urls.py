# api/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
# Import tous viewsets
from .views import (
    SocieteViewSet,
    ContactViewSet,
    MandatViewSet,
    GroupeViewSet,
    InteractionViewSet
)

# Création du router
router = DefaultRouter()
router.register(r'societes', SocieteViewSet)
router.register(r'contacts', ContactViewSet)
router.register(r'mandats', MandatViewSet)
router.register(r'groupes', GroupeViewSet)
router.register(r'interactions', InteractionViewSet)

# Les modèles d'URL *dans ce fichier* incluent simplement les URL du routeur
urlpatterns = [
    path('', include(router.urls)),
]