# api/serializers.py
from rest_framework import serializers
# Assurez-vous d'importer les DEUX modèles
from .models import Societe, Contact, Mandat, Groupe

# Class pour filiales
class FilialeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Societe
        fields = ['id', 'nom']  # On ne veut que l'ID et le nom

# Class pour sociétés
class SocieteSerializer(serializers.ModelSerializer):
    # --- AJOUT : Le nom de la maison mère ---
    maison_mere_nom = serializers.StringRelatedField(source='maison_mere', read_only=True)

    # --- AJOUT : La liste des filiales ---
    filiales = FilialeSerializer(many=True, read_only=True)

    class Meta:
        model = Societe
        # On liste tous les champs manuellement
        fields = [
            'id', 'nom', 'siren', 'code_naf', 'secteur', 'activite_detaille',
            'adresse', 'code_postal', 'ville', 'region', 'pays',
            'date_creation', 'forme_juridique', 'capital_social',
            'derniere_annee_disponible', 'capitaux_propres',
            'ca_n', 'ca_n1', 'ca_n2',
            'resultat_exploitation_n', 'resultat_exploitation_n1', 'resultat_exploitation_n2',
            'resultat_net_n', 'resultat_net_n1', 'resultat_net_n2',
            'ebitda_n', 'ebitda_n1', 'ebitda_n2',
            'effectif', 'effectif_approximatif',
            'numero_standard', 'email_standard', 'site_web', 'lien_linkedin',

            # Les nouveaux champs
            'maison_mere',  # L'ID de la maison mère (pour la modification)
            'maison_mere_nom',  # Le nom (pour l'affichage)
            'filiales'  # La liste des filiales
        ]

# Class pour contacts
class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = '__all__'

# Class pour Mandats
class MandatSerializer(serializers.ModelSerializer):
    client_nom = serializers.StringRelatedField(source='client', read_only=True)

    # On dit au serializer d'inclure les objets Société complets, c'est comme un "sous-serializer"
    acheteurs_potentiels = SocieteSerializer(many=True, read_only=True)
    cedants_potentiels = SocieteSerializer(many=True, read_only=True)

    class Meta:
        model = Mandat
        fields = [
            'id', 'nom_mandat', 'client', 'client_nom', 'type_mandat', 'statut',
            'phase', 'valorisation_estimee', 'honoraires_estimes',
            'acheteurs_potentiels', 'cedants_potentiels'
        ]

# Class pour Groupe
class GroupeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Groupe
        fields = ['id', 'nom', 'description'] # On prend tous les champs