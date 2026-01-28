"""
Django Admin Configuration for Helix Platform

Provides admin interface for managing brands and projects.
Admins can view all brands and projects, with filtering and search capabilities.
"""

from django.contrib import admin
from .models import Brand, Project


@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    """
    Admin interface for Brand model.
    """
    list_display = ['id', 'brand_name', 'email', 'uid', 'created_at']
    list_filter = ['created_at']
    search_fields = ['brand_name', 'email', 'uid']
    readonly_fields = ['uid', 'created_at', 'updated_at']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Brand Information', {
            'fields': ('brand_name', 'email', 'uid')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    """
    Admin interface for Project model.
    """
    list_display = [
        'id',
        'get_brand_name',
        'service_type',
        'status',
        'created_at'
    ]
    list_filter = ['status', 'service_type', 'created_at']
    search_fields = [
        'brand__brand_name',
        'brand__email',
        'requirements_text'
    ]
    readonly_fields = ['created_at', 'updated_at']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Project Information', {
            'fields': ('brand', 'service_type', 'requirements_text')
        }),
        ('Status', {
            'fields': ('status',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_brand_name(self, obj):
        """Display brand name in list view"""
        return obj.brand.brand_name
    get_brand_name.short_description = 'Brand Name'
    get_brand_name.admin_order_field = 'brand__brand_name'


# Customize admin site headers
admin.site.site_header = 'Helix Platform Admin'
admin.site.site_title = 'Helix Admin'
admin.site.index_title = 'Welcome to Helix Platform Administration'
