# api/serializers.py
from rest_framework import serializers
from .models import Societe

class SocieteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Societe
        fields = '__all__' # Pour l'instant, on expose tous les champs