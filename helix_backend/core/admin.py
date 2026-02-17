"""
Django Admin Configuration for Helix Platform — Phase 2
"""

from django.contrib import admin

from core.models import User, Request, RequestActivity


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ["id", "email", "uid", "role", "is_active", "created_at"]
    list_filter = ["role", "is_active", "created_at"]
    search_fields = ["email", "uid"]
    readonly_fields = ["uid", "created_at"]
    ordering = ["-created_at"]

    fieldsets = (
        ("User Information", {"fields": ("uid", "email", "role", "is_active")}),
        ("Timestamps", {"fields": ("created_at",), "classes": ("collapse",)}),
    )


@admin.register(Request)
class RequestAdmin(admin.ModelAdmin):
    list_display = [
        "id", "title", "get_user_email", "status", "priority",
        "get_assigned_to", "created_at", "updated_at",
    ]
    list_filter = ["status", "priority", "assigned_to", "created_at"]
    search_fields = ["title", "description", "user__email"]
    readonly_fields = ["created_at", "updated_at"]
    ordering = ["-created_at"]

    fieldsets = (
        ("Request Information", {"fields": ("user", "title", "description")}),
        ("Workflow", {"fields": ("status", "priority", "assigned_to")}),
        ("Timestamps", {"fields": ("created_at", "updated_at"), "classes": ("collapse",)}),
    )

    @admin.display(description="User Email", ordering="user__email")
    def get_user_email(self, obj):
        return obj.user.email

    @admin.display(description="Assigned To", ordering="assigned_to__email")
    def get_assigned_to(self, obj):
        return obj.assigned_to.email if obj.assigned_to else "—"


@admin.register(RequestActivity)
class RequestActivityAdmin(admin.ModelAdmin):
    list_display = ["id", "get_request_title", "action", "get_performed_by", "timestamp"]
    list_filter = ["action", "timestamp"]
    search_fields = ["request__title", "detail", "performed_by__email"]
    readonly_fields = ["request", "action", "detail", "performed_by", "timestamp"]
    ordering = ["-timestamp"]

    @admin.display(description="Request", ordering="request__title")
    def get_request_title(self, obj):
        return obj.request.title

    @admin.display(description="Performed By", ordering="performed_by__email")
    def get_performed_by(self, obj):
        return obj.performed_by.email if obj.performed_by else "—"


# ── Admin site branding ──────────────────────────────────────────
admin.site.site_header = "Helix Platform Admin"
admin.site.site_title = "Helix Admin"
admin.site.index_title = "Welcome to Helix Platform Administration"
