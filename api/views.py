# api/views.py
from rest_framework import viewsets, status
from rest_framework.permissions import AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.filters import SearchFilter
from django.db.models import Q
from .models import Societe, Contact, Mandat, Groupe
from .serializers import SocieteSerializer, ContactSerializer, MandatSerializer, GroupeSerializer


class SocieteViewSet(viewsets.ModelViewSet):
    queryset = Societe.objects.all()
    serializer_class = SocieteSerializer
    permission_classes = [AllowAny]
    filter_backends = [SearchFilter]
    search_fields = ['nom', 'siren']


class ContactViewSet(viewsets.ModelViewSet):
    serializer_class = ContactSerializer
    queryset = Contact.objects.all()
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Contact.objects.all()
        societe_id = self.request.query_params.get('societe_id')
        if societe_id is not None:
            queryset = queryset.filter(societe_id=societe_id)
        return queryset


class MandatViewSet(viewsets.ModelViewSet):
    serializer_class = MandatSerializer
    queryset = Mandat.objects.all()
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Mandat.objects.all()
        societe_id = self.request.query_params.get('societe_id')
        if societe_id is not None:
            queryset = queryset.filter(
                Q(client_id=societe_id) |
                Q(acheteurs_potentiels__id=societe_id) |
                Q(cedants_potentiels__id=societe_id)
            ).distinct()
        return queryset

    # --- LES ACTIONS SONT ICI, DANS MANDATVIEWSET ---

    def _get_societe(self, request):
        """Fonction helper pour récupérer l'objet société depuis l'ID."""
        societe_id = request.data.get('societe_id')
        if not societe_id:
            return None, Response({'detail': 'societe_id manquant.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            societe = Societe.objects.get(id=societe_id)
            return societe, None
        except Societe.DoesNotExist:
            return None, Response({'detail': 'Société non trouvée.'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['post'])
    def add_acheteur(self, request, pk=None):
        """Ajoute une société aux acheteurs potentiels."""
        mandat = self.get_object()
        societe, error_response = self._get_societe(request)
        if error_response:
            return error_response

        mandat.acheteurs_potentiels.add(societe)
        return Response({'status': 'Acheteur ajouté'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def remove_acheteur(self, request, pk=None):
        """Retire une société des acheteurs potentiels."""
        mandat = self.get_object()
        societe, error_response = self._get_societe(request)
        if error_response:
            return error_response

        mandat.acheteurs_potentiels.remove(societe)
        return Response({'status': 'Acheteur retiré'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def add_cedant(self, request, pk=None):
        """Ajoute une société aux cédants potentiels."""
        mandat = self.get_object()
        societe, error_response = self._get_societe(request)
        if error_response:
            return error_response

        mandat.cedants_potentiels.add(societe)
        return Response({'status': 'Cédant ajouté'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def remove_cedant(self, request, pk=None):
        """Retire une société des cédants potentiels."""
        mandat = self.get_object()
        societe, error_response = self._get_societe(request)
        if error_response:
            return error_response

        mandat.cedants_potentiels.remove(societe)
        return Response({'status': 'Cédant retiré'}, status=status.HTTP_200_OK)


# --- FIN DE MANDATVIEWSET ---


# --- DÉBUT DE GROUPEVIEWSET (SIMPLE) ---
class GroupeViewSet(viewsets.ModelViewSet):
    queryset = Groupe.objects.all().order_by('nom')
    serializer_class = GroupeSerializer
    permission_classes = [AllowAny]
# --- FIN DE GROUPEVIEWSET ---