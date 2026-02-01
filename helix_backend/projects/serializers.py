"""
Django REST Framework Serializers for Helix Platform

Serializers handle conversion between model instances and JSON data.
"""

from rest_framework import serializers
from .models import Brand, Project


class BrandSerializer(serializers.ModelSerializer):
    """
    Serializer for Brand model.
    Used for creating and retrieving brand information.
    """
    
    class Meta:
        model = Brand
        fields = ['id', 'uid', 'brand_name', 'email', 'role', 'created_at', 'updated_at']
        read_only_fields = ['id', 'uid', 'created_at', 'updated_at']


class BrandProfileSerializer(serializers.ModelSerializer):
    """
    Minimal serializer for user profile endpoint.
    Returns essential user information including role for frontend auth.
    """
    
    class Meta:
        model = Brand
        fields = ['email', 'brand_name', 'role']


class ProjectSerializer(serializers.ModelSerializer):
    """
    Serializer for Project model.
    Includes brand information in read operations.
    """
    
    # Include brand details in responses
    brand_name = serializers.CharField(source='brand.brand_name', read_only=True)
    brand_email = serializers.EmailField(source='brand.email', read_only=True)
    
    class Meta:
        model = Project
        fields = [
            'id',
            'brand',
            'brand_name',
            'brand_email',
            'service_type',
            'requirements_text',
            'status',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'brand', 'brand_name', 'brand_email', 'created_at', 'updated_at']


class ProjectCreateSerializer(serializers.ModelSerializer):
    """
    Serializer specifically for creating new projects.
    Only accepts service_type and requirements_text from frontend.
    Brand is automatically linked based on authenticated user's UID.
    """
    
    class Meta:
        model = Project
        fields = ['service_type', 'requirements_text']
    
    def validate_service_type(self, value):
        """
        Validate that service_type is one of the allowed choices.
        """
        valid_types = [choice[0] for choice in Project.SERVICE_CHOICES]
        if value not in valid_types:
            raise serializers.ValidationError(
                f"Invalid service type. Must be one of: {', '.join(valid_types)}"
            )
        return value
    
    def validate_requirements_text(self, value):
        """
        Validate that requirements text is not empty and has minimum length.
        """
        if not value or len(value.strip()) < 10:
            raise serializers.ValidationError(
                "Requirements must be at least 10 characters long"
            )
        return value.strip()


class ProjectListSerializer(serializers.ModelSerializer):
    """
    Simplified serializer for listing projects.
    Optimized for list views with less data.
    """
    
    brand_name = serializers.CharField(source='brand.brand_name', read_only=True)
    service_type_display = serializers.CharField(source='get_service_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = Project
        fields = [
            'id',
            'brand_name',
            'service_type',
            'service_type_display',
            'status',
            'status_display',
            'created_at',
        ]
        read_only_fields = fields
