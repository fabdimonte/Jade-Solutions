# api/models.py
from django.db import models
from django.utils import timezone


# ==============================================================================
# MODÈLE SOCIETE
# ==============================================================================
# C'est l'entité centrale. Elle contient toutes les informations
# juridiques et financières sur une entreprise.
# ==============================================================================
class Societe(models.Model):
    # --- Identification ---
    nom = models.CharField(max_length=255, verbose_name="Nom de la société")
    siren = models.CharField(max_length=9, unique=True, verbose_name="Numéro SIREN")
    code_naf = models.CharField(max_length=255, blank=True, verbose_name="Code NAF")
    secteur = models.CharField(max_length=255, blank=True, verbose_name="Secteur d'activité")
    activite_detaille = models.TextField(blank=True, verbose_name="Activité détaillée")
    numero_standard = models.CharField(max_length=20, blank=True, verbose_name="Numéro de téléphone standard")
    email_standard = models.EmailField(blank=True, verbose_name="Email standard")
    site_web = models.URLField(blank=True)
    lien_linkedin = models.URLField(blank=True, verbose_name="Lien page LinkedIn")

    # --- Coordonnées ---
    adresse = models.CharField(max_length=255, blank=True)
    code_postal = models.CharField(max_length=10, blank=True)
    ville = models.CharField(max_length=100, blank=True)
    region = models.CharField(max_length=100, blank=True)
    pays = models.CharField(max_length=100, blank=True, default="France")

    # --- Informations Juridiques ---
    date_creation = models.DateField(null=True, blank=True, verbose_name="Date de création")
    forme_juridique = models.CharField(max_length=100, blank=True)
    capital_social = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)

    # --- Données Financières ---
    # On utilise DecimalField pour l'argent, c'est crucial pour éviter les erreurs d'arrondi.
    derniere_annee_disponible = models.IntegerField(null=True, blank=True, help_text="Ex: 2024")
    capitaux_propres = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    ca_n = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True,verbose_name="Chiffre d'affaires N")
    ca_n1 = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True,verbose_name="Chiffre d'affaires N-1")
    ca_n2 = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True,verbose_name="Chiffre d'affaires N-2")
    resultat_exploitation_n = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True,verbose_name="Résultat d'exploitation N")
    resultat_exploitation_n1 = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True,verbose_name="Résultat d'exploitation N-1")
    resultat_exploitation_n2 = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True,verbose_name="Résultat d'exploitation N-2")
    resultat_net_n = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True,verbose_name="Résultat net N")
    resultat_net_n1 = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True,verbose_name="Résultat net N-1")
    resultat_net_n2 = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True,verbose_name="Résultat net N-2")
    ebitda_n = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True, verbose_name="EBITDA N")
    ebitda_n1 = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True, verbose_name="EBITDA N-1")
    ebitda_n2 = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True, verbose_name="EBITDA N-2")

    # --- Informations Complémentaires ---
    effectif = models.IntegerField(null=True, blank=True, verbose_name="Effectif précis")
    effectif_approximatif = models.CharField(max_length=50, blank=True, verbose_name="Tranche d'effectif")

    # --- Gestion des filiales (Très important) ---
    # Un lien vers une autre société (elle-même).
    # Une société peut avoir une maison mère, et plusieurs filiales.
    maison_mere = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='filiales')

    def __str__(self):
        return self.nom


# ==============================================================================
# MODÈLE GROUPE
# ==============================================================================
# Permet de regrouper des contacts pour des actions ciblées (mailing, etc.)
# ==============================================================================
class Groupe(models.Model):
    nom = models.CharField(max_length=100, unique=True, verbose_name="Nom du groupe")
    description = models.TextField(blank=True)

    # Plus tard, on pourra ajouter ici des champs pour les règles d'affectation automatique.

    def __str__(self):
        return self.nom


# ==============================================================================
# MODÈLE CONTACT
# ==============================================================================
# Une personne physique, liée à une société.
# ==============================================================================
class Contact(models.Model):
    class StatutContact(models.TextChoices):
        A_QUALIFIER = 'A_QUALIFIER', 'À qualifier'
        INJOIGNABLE = 'INJOIGNABLE', 'Injoignable'
        PAS_DE_PROJET = 'PAS_DE_PROJET', 'Pas de projet actuellement'
        CONTACT_EXPERT = 'CONTACT_EXPERT', 'Contact expert'
        A_RELANCER = 'A_RELANCER', 'À relancer'
        NE_PLUS_CONTACTER = 'NE_PLUS_CONTACTER', 'Ne plus contacter'

    class Denominatif(models.TextChoices):
        MONSIEUR = 'MR', 'Mr.'
        MADAME = 'MME', 'Mme.'
        AUTRE = 'AUTRE', 'Autre'

    # --- Identification ---
    denominatif = models.CharField(max_length=5, choices=Denominatif.choices, blank=True)
    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100)
    fonction = models.CharField(max_length=255, blank=True)
    date_de_naissance = models.DateField(null=True, blank=True)

    # --- Coordonnées ---
    email = models.EmailField(unique=True, null=True, blank=True, verbose_name="Email professionnel")
    telephone_fixe = models.CharField(max_length=20, blank=True)
    telephone_portable = models.CharField(max_length=20, blank=True)
    linkedin = models.URLField(blank=True, verbose_name="Profil LinkedIn")

    # --- Rattachement ---
    societe = models.ForeignKey(Societe, on_delete=models.CASCADE, related_name='contacts')
    groupes = models.ManyToManyField(Groupe, blank=True, related_name='contacts')

    # --- Suivi & Statut ---
    statut = models.CharField(max_length=20, choices=StatutContact.choices, default=StatutContact.A_QUALIFIER)
    date_creation = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)
    date_dernier_mailing = models.DateTimeField(null=True, blank=True)
    date_dernier_appel = models.DateTimeField(null=True, blank=True)
    date_dernier_mail = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.prenom} {self.nom}"


# ==============================================================================
# MODÈLE MANDAT
# ==============================================================================
# Le coeur du métier M&A : le deal, la mission.
# ==============================================================================
class Mandat(models.Model):
    class TypeMandat(models.TextChoices):
        SELL_SIDE = 'SELL', 'Sell-Side (Cession)'
        BUY_SIDE = 'BUY', 'Buy-Side (Acquisition)'
        LEVEE_FONDS = 'FUND', 'Levée de fonds'
        AUTRE = 'AUTRE', 'Autre'

    class StatutMandat(models.TextChoices):
        PROSPECTION = 'PROSP', 'Prospection'
        EN_COURS = 'EN_COURS', 'En cours'
        CLOSING = 'CLOSING', 'En closing'
        TERMINE = 'TERMINE', 'Terminé'
        ABANDONNE = 'ABANDONNE', 'Abandonné'

    class PhaseMandat(models.TextChoices):
        # Phases pour un mandat de Cession (Sell-Side)
        PREPARATION = 'PREPA', 'Préparation (Teaser, IM)'
        MARKETING = 'MARKET', 'Phase de marketing'
        NEGOCIATION = 'NEGO', 'Négociation (LOI)'
        DUE_DILIGENCE = 'DUE_DIL', 'Due Diligence'
        SIGNATURE = 'SIGN', 'Signature (SPA)'
        # On pourra ajouter des phases spécifiques pour les autres types de mandats

    # --- Identification du mandat ---
    nom_mandat = models.CharField(max_length=255, verbose_name="Nom du mandat (ex: Projet Phoenix)")
    client = models.ForeignKey(Societe, on_delete=models.PROTECT, related_name='mandats_client',
                               verbose_name="Société cliente")
    type_mandat = models.CharField(max_length=10, choices=TypeMandat.choices)
    statut = models.CharField(max_length=10, choices=StatutMandat.choices)
    phase = models.CharField(max_length=10, choices=PhaseMandat.choices, blank=True)

    # --- Parties Prenantes ---
    # ManyToManyField car un mandat peut avoir plusieurs acheteurs/cédants potentiels.
    acheteurs_potentiels = models.ManyToManyField(Societe, blank=True, related_name='mandats_achat_potentiel')
    cedants_potentiels = models.ManyToManyField(Societe, blank=True, related_name='mandats_cession_potentiel')

    # --- Données Financières du Mandat ---
    valorisation_estimee = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True,
                                               verbose_name="Valorisation estimée (€)")
    honoraires_estimes = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True,
                                             verbose_name="Honoraires estimés (€)")

    def __str__(self):
        return self.nom_mandat