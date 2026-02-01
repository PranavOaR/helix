"""
URL Configuration for Projects App

Stage 1 Endpoints:
- POST /api/projects/create/ - Create new project
- GET /api/projects/my-projects/ - Get user's projects
- GET /api/projects/<id>/ - Get specific project details
- GET /api/projects/health/ - Health check (no auth required)
- GET /api/projects/user/profile/ - Get user profile with role
- GET /api/projects/all/ - Get all projects (admin only)
- PATCH /api/projects/<id>/update-status/ - Update project status (admin only)
"""

from django.urls import path
from . import views

urlpatterns = [
    # Health check endpoint (no authentication required)
    path('health/', views.health_check, name='health-check'),
    
    # User profile endpoint
    path('user/profile/', views.get_user_profile, name='user-profile'),
    
    # Project endpoints (authentication required)
    path('create/', views.create_project, name='create-project'),
    path('my-projects/', views.get_my_projects, name='my-projects'),
    path('<int:project_id>/', views.get_project_detail, name='project-detail'),
    
    # Admin endpoints (admin role required)
    path('all/', views.get_all_projects, name='all-projects'),
    path('<int:project_id>/update-status/', views.update_project_status, name='update-project-status'),
]
