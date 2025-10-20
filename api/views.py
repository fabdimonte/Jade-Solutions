# api/views.py
from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from .models import Societe, Contact, Mandat  # <-- Importer Mandat
from .serializers import SocieteSerializer, ContactSerializer, MandatSerializer # <-- Importer MandatSerializer
from django.db.models import Q  # <-- IMPORTER Q pour les filtres complexes

class SocieteViewSet(viewsets.ModelViewSet):
    queryset = Societe.objects.all()
    serializer_class = SocieteSerializer
    permission_classes = [AllowAny]

class ContactViewSet(viewsets.ModelViewSet):
    serializer_class = ContactSerializer
    queryset = Contact.objects.all()
    permission_classes = [AllowAny]

    def get_queryset(self):
        # ... (code de filtrage des contacts inchangé)
        queryset = Contact.objects.all()
        societe_id = self.request.query_params.get('societe_id')
        if societe_id is not None:
            queryset = queryset.filter(societe_id=societe_id)
        return queryset

# 👇 AJOUTEZ CE NOUVEAU VIEWSET 👇
class MandatViewSet(viewsets.ModelViewSet):
    serializer_class = MandatSerializer
    queryset = Mandat.objects.all()
    permission_classes = [AllowAny]

    # Logique de filtrage pour les mandats
    def get_queryset(self):
        queryset = Mandat.objects.all()

        # On vérifie si l'URL contient un filtre 'societe_id'
        # ex: /api/mandats/?societe_id=1
        societe_id = self.request.query_params.get('societe_id')

        if societe_id is not None:
            # On cherche les mandats où la société est :
            # 1. Le client (client=societe_id)
            # 2. OU dans la liste des acheteurs (acheteurs_potentiels__id=societe_id)
            # 3. OU dans la liste des cédants (cedants_potentiels__id=societe_id)
            queryset = queryset.filter(
                Q(client_id=societe_id) |
                Q(acheteurs_potentiels__id=societe_id) |
                Q(cedants_potentiels__id=societe_id)
            ).distinct() # .distinct() pour éviter les doublons

        return queryset