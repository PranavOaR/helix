"""
Database Models for Helix Platform - Stage 1

Brand Model: Stores brand/client information linked to Firebase UID
Project Model: Stores service requests submitted by brands
"""

from django.db import models
from django.utils import timezone


class Brand(models.Model):
    """
    Brand/Client model linked to Firebase Authentication.
    
    Each brand is uniquely identified by their Firebase UID.
    This model stores additional brand information beyond what Firebase provides.
    """
    
    uid = models.CharField(
        max_length=128,
        unique=True,
        db_index=True,
        help_text="Firebase Authentication UID"
    )
    
    brand_name = models.CharField(
        max_length=255,
        help_text="Name of the brand/company"
    )
    
    email = models.EmailField(
        help_text="Brand contact email (from Firebase Auth)"
    )
    
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Timestamp when brand was first registered"
    )
    
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="Timestamp of last update"
    )
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Brand'
        verbose_name_plural = 'Brands'
    
    def __str__(self):
        return f"{self.brand_name} ({self.email})"


class Project(models.Model):
    """
    Project/Service Request model.
    
    Represents a service request submitted by a brand.
    Each project is linked to a specific brand and tracks the service type,
    requirements, and current status.
    """
    
    # Service Type Choices
    SERVICE_CHOICES = [
        ('website', 'Website Development'),
        ('uiux', 'UI/UX Design'),
        ('branding', 'Branding'),
        ('app', 'App Development'),
        ('canva', 'Canva Design'),
    ]
    
    # Status Choices
    STATUS_CHOICES = [
        ('submitted', 'Submitted'),
        ('in_review', 'In Review'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('on_hold', 'On Hold'),
    ]
    
    brand = models.ForeignKey(
        Brand,
        on_delete=models.CASCADE,
        related_name='projects',
        help_text="Brand that submitted this project"
    )
    
    service_type = models.CharField(
        max_length=50,
        choices=SERVICE_CHOICES,
        help_text="Type of service requested"
    )
    
    requirements_text = models.TextField(
        help_text="Detailed requirements and description from the brand"
    )
    
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='submitted',
        help_text="Current status of the project"
    )
    
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Timestamp when project was submitted"
    )
    
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="Timestamp of last update"
    )
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Project'
        verbose_name_plural = 'Projects'
        indexes = [
            models.Index(fields=['brand', 'status']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"{self.brand.brand_name} - {self.get_service_type_display()} ({self.status})"
    
    @property
    def brand_uid(self):
        """Helper property to access brand's Firebase UID"""
        return self.brand.uid
