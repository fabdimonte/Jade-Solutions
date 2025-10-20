# api/views.py
from rest_framework import viewsets
from .models import Societe, Contact
from .serializers import SocieteSerializer, ContactSerializer


class SocieteViewSet(viewsets.ModelViewSet):
    queryset = Societe.objects.all()
    serializer_class = SocieteSerializer


class ContactViewSet(viewsets.ModelViewSet):
    serializer_class = ContactSerializer
    queryset = Contact.objects.all()  # <--- AJOUTEZ CETTE LIGNE

    # Ta méthode de filtrage personnalisée
    def get_queryset(self):
        # On récupère le queryset de base
        queryset = Contact.objects.all()

        # On vérifie si l'URL contient un filtre 'societe_id'
        societe_id = self.request.query_params.get('societe_id')

        if societe_id is not None:
            # Si oui, on filtre le queryset
            queryset = queryset.filter(societe_id=societe_id)

        return queryset