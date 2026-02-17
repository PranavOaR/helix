"""
Root URL Configuration for helix_backend project.
"""

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('core.urls')),

    # Backward-compatible routes for existing frontend
    path('api/v1/', include('core.urls')),
]
