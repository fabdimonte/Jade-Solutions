# api/views.py
from rest_framework import viewsets
from .models import Societe
from .serializers import SocieteSerializer

class SocieteViewSet(viewsets.ModelViewSet):
    queryset = Societe.objects.all()
    serializer_class = SocieteSerializer