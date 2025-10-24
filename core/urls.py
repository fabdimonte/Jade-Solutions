# core/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('auth/', include('dj_rest_auth.urls')),
    # If you install allauth for registration later, you'll add its urls too:
    # path('auth/registration/', include('dj_rest_auth.registration.urls')), # Example
]