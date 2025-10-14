# api/admin.py
from django.contrib import admin
from .models import Societe, Contact, Mandat, Groupe

# On dit à Django d'afficher ces modèles sur la page d'administration
admin.site.register(Societe)
admin.site.register(Contact)
admin.site.register(Mandat)
admin.site.register(Groupe)