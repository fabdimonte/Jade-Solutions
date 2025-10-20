# api/serializers.py
from rest_framework import serializers
# Assurez-vous d'importer les DEUX modèles
from .models import Societe, Contact

class SocieteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Societe
        fields = '__all__'

# 👇 AJOUTEZ CETTE NOUVELLE CLASSE 👇
class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = '__all__'