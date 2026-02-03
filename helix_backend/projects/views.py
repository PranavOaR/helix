"""
API Views for Helix Platform - Stage 1

Endpoints:
- POST /api/projects/create/ - Create a new project (authenticated)
- GET /api/projects/my-projects/ - Get all projects for authenticated user
- GET /api/projects/<id>/ - Get specific project (authenticated, owner only)
- GET /api/projects/health/ - Health check (public)
- GET /api/projects/user/profile/ - Get user profile with role (authenticated)
- GET /api/projects/all/ - Get all projects (admin only)
- PATCH /api/projects/<id>/update-status/ - Update project status (admin only)
"""

import logging
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db import transaction

from .models import Brand, Project
from .serializers import (
    ProjectCreateSerializer,
    ProjectSerializer,
    ProjectListSerializer,
    BrandProfileSerializer
)
from authentication.firebase_auth import require_admin

logger = logging.getLogger(__name__)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_project(request):
    """
    Create a new project for the authenticated brand.
    
    POST /api/projects/create/
    
    Request Headers:
        Authorization: Bearer <firebase_id_token>
    
    Request Body:
        {
            "service_type": "website",  // website, uiux, branding, app, canva
            "requirements_text": "I need a Shopify store with..."
        }
    
    Response (201 Created):
        {
            "success": true,
            "message": "Project created successfully",
            "project": {
                "id": 1,
                "brand": 1,
                "brand_name": "Acme Corp",
                "brand_email": "contact@acme.com",
                "service_type": "website",
                "requirements_text": "...",
                "status": "submitted",
                "created_at": "2026-01-28T10:30:00Z",
                "updated_at": "2026-01-28T10:30:00Z"
            }
        }
    """
    
    # Get Firebase UID from authenticated request
    # request.user is the UID string returned by FirebaseAuthentication
    firebase_uid = str(request.user)
    
    # Get email from token if available
    token_data = request.auth  # This is the decoded_token from FirebaseAuthentication
    email = token_data.get('email', '') if token_data else ''
    
    # Validate incoming data
    serializer = ProjectCreateSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({
            'success': False,
            'message': 'Invalid data provided',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        with transaction.atomic():
            # Get or create Brand record for this Firebase user
            brand, created = Brand.objects.get_or_create(
                uid=firebase_uid,
                defaults={
                    'email': email,
                    'brand_name': email.split('@')[0] if email else f'Brand-{firebase_uid[:8]}'
                }
            )
            
            # If brand exists but email changed, update it
            if not created and email and brand.email != email:
                brand.email = email
                brand.save(update_fields=['email'])
            
            # Create the project
            project = Project.objects.create(
                brand=brand,
                service_type=serializer.validated_data['service_type'],
                requirements_text=serializer.validated_data['requirements_text']
            )
            
            # Serialize response
            response_serializer = ProjectSerializer(project)
            
            return Response({
                'success': True,
                'message': 'Project created successfully',
                'project': response_serializer.data
            }, status=status.HTTP_201_CREATED)
    
    except Exception as e:
        return Response({
            'success': False,
            'message': f'Failed to create project: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_my_projects(request):
    """
    Get all projects for the authenticated brand.
    
    GET /api/projects/my-projects/
    
    Request Headers:
        Authorization: Bearer <firebase_id_token>
    
    Response (200 OK):
        {
            "success": true,
            "count": 2,
            "projects": [
                {
                    "id": 1,
                    "brand_name": "Acme Corp",
                    "service_type": "website",
                    "service_type_display": "Website Development",
                    "status": "submitted",
                    "status_display": "Submitted",
                    "created_at": "2026-01-28T10:30:00Z"
                },
                ...
            ]
        }
    """
    
    # Get Firebase UID from authenticated request
    firebase_uid = str(request.user)
    
    try:
        # Get brand record for this Firebase user
        try:
            brand = Brand.objects.get(uid=firebase_uid)
        except Brand.DoesNotExist:
            # User is authenticated but hasn't created any projects yet
            return Response({
                'success': True,
                'count': 0,
                'projects': [],
                'message': 'No projects found. Create your first project!'
            }, status=status.HTTP_200_OK)
        
        # Get all projects for this brand
        projects = Project.objects.filter(brand=brand).select_related('brand')
        
        # Serialize response
        serializer = ProjectListSerializer(projects, many=True)
        
        return Response({
            'success': True,
            'count': projects.count(),
            'projects': serializer.data
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response({
            'success': False,
            'message': f'Failed to retrieve projects: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_project_detail(request, project_id):
    """
    Get detailed information about a specific project.
    
    GET /api/projects/<project_id>/
    
    Only returns project if it belongs to the authenticated user.
    """
    
    firebase_uid = str(request.user)
    
    try:
        # Get the project and verify ownership
        project = Project.objects.select_related('brand').get(
            id=project_id,
            brand__uid=firebase_uid
        )
        
        serializer = ProjectSerializer(project)
        
        return Response({
            'success': True,
            'project': serializer.data
        }, status=status.HTTP_200_OK)
    
    except Project.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Project not found or access denied'
        }, status=status.HTTP_404_NOT_FOUND)
    
    except Exception as e:
        return Response({
            'success': False,
            'message': f'Failed to retrieve project: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([])  # No authentication required
def health_check(request):
    """
    Simple health check endpoint to verify API is running.
    
    GET /api/projects/health/
    
    No authentication required.
    """
    return Response({
        'status': 'healthy',
        'message': 'Helix API is running',
        'version': 'Stage 1'
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    """
    Get the profile of the authenticated user including their role.
    
    GET /api/projects/user/profile/
    
    Response:
        {
            "email": "user@example.com",
            "brand_name": "My Brand",
            "role": "USER"
        }
    
    Role determination priority:
    1. Firebase custom claims (admin: true)
    2. Database Brand.role field
    3. Default: USER
    """
    firebase_user = request.user
    firebase_uid = firebase_user.uid
    email = firebase_user.email or ''
    
    # Log for debugging
    logger.info(f"[PROFILE] Fetching profile for: {email}, is_admin_claim: {firebase_user.is_admin_claim}")
    
    try:
        # First, try to find existing user by email (for pre-configured accounts)
        brand = None
        try:
            brand = Brand.objects.get(email=email)
            # Update UID if it's different (e.g., from placeholder to real Firebase UID)
            if brand.uid != firebase_uid:
                logger.info(f"[PROFILE] Updating UID for {email}: {brand.uid[:8]}... -> {firebase_uid[:8]}...")
                brand.uid = firebase_uid
                brand.save()
        except Brand.DoesNotExist:
            # If not found by email, try to get or create by UID
            token_data = request.auth
            brand, created = Brand.objects.get_or_create(
                uid=firebase_uid,
                defaults={
                    'brand_name': token_data.get('name', email.split('@')[0]) if token_data else 'User',
                    'email': email,
                    'role': 'USER'  # Default role
                }
            )
            if created:
                logger.info(f"[PROFILE] Created new Brand for: {email}")
        
        # If user has Firebase admin claim but DB says USER, sync it
        if firebase_user.is_admin_claim and brand.role != 'ADMIN':
            logger.info(f"[PROFILE] Syncing admin claim to DB for: {email}")
            brand.role = 'ADMIN'
            brand.save(update_fields=['role'])
        
        serializer = BrandProfileSerializer(brand)
        response_data = serializer.data
        
        # Override role based on Firebase claims (takes priority)
        if firebase_user.is_admin_claim:
            response_data['role'] = 'ADMIN'
        
        logger.info(f"[PROFILE] Returning profile for {email}: role={response_data.get('role')}")
        
        return Response(response_data, status=status.HTTP_200_OK)
    
    except Exception as e:
        logger.error(f"[PROFILE] Error fetching profile for {email}: {e}")
        return Response({
            'error': f'Failed to retrieve profile: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@require_admin
def get_all_projects(request):
    """
    Get all projects (admin only).
    
    GET /api/projects/all/
    
    Requires admin role (via Firebase custom claim or database).
    Protected by @require_admin decorator.
    """
    logger.info(f"[ADMIN] get_all_projects accessed by: {request.user.email}")
    
    try:
        # Get all projects
        projects = Project.objects.all().select_related('brand')
        serializer = ProjectListSerializer(projects, many=True)
        
        logger.info(f"[ADMIN] Returning {projects.count()} projects")
        
        return Response({
            'success': True,
            'count': projects.count(),
            'projects': serializer.data
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        logger.error(f"[ADMIN] Error in get_all_projects: {e}")
        return Response({
            'success': False,
            'message': f'Failed to retrieve projects: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
@require_admin
def update_project_status(request, project_id):
    """
    Update the status of a project (admin only).
    
    PATCH /api/projects/<project_id>/update-status/
    
    Request Body:
        {
            "status": "ACCEPTED"
        }
    
    Requires admin role. Protected by @require_admin decorator.
    """
    new_status = request.data.get('status')
    
    logger.info(f"[ADMIN] update_project_status: project={project_id}, new_status={new_status}, by={request.user.email}")
    
    if not new_status:
        return Response({
            'success': False,
            'message': 'Status is required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Update project status
        project = Project.objects.get(id=project_id)
        project.status = new_status.lower()
        project.save()
        
        serializer = ProjectSerializer(project)
        
        logger.info(f"[ADMIN] Project {project_id} status updated to: {new_status}")
        
        return Response({
            'success': True,
            'message': 'Status updated successfully',
            'project': serializer.data
        }, status=status.HTTP_200_OK)
    
    except Project.DoesNotExist:
        logger.warning(f"[ADMIN] Project {project_id} not found")
        return Response({
            'success': False,
            'message': 'Project not found'
        }, status=status.HTTP_404_NOT_FOUND)
    
    except Exception as e:
        logger.error(f"[ADMIN] Error updating project {project_id}: {e}")
        return Response({
            'success': False,
            'message': f'Failed to update status: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
