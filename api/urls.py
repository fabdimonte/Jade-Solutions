# api/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
# Importer les TROIS viewsets
from .views import SocieteViewSet, ContactViewSet, MandatViewSet, GroupeViewSet

router = DefaultRouter()
router.register(r'societes', SocieteViewSet)
router.register(r'contacts', ContactViewSet)
router.register(r'mandats', MandatViewSet)
router.register(r'groupes', GroupeViewSet)

urlpatterns = [
    path('', include(router.urls)),
]