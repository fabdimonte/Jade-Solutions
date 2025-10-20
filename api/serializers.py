# api/serializers.py
from rest_framework import serializers
# Assurez-vous d'importer les DEUX modèles
from .models import Societe, Contact, Mandat, Groupe

# Class pour Sociétés
class SocieteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Societe
        fields = '__all__'

# Class pour contacts
class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = '__all__'

# Class pour Mandats
class MandatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mandat
        fields = '__all__'