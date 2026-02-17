"""
Django REST Framework Serializers for Helix Platform — Phase 2

RequestCreateSerializer     — validates incoming request creation data
RequestSerializer           — full read representation of a Request
RequestStatusSerializer     — validates workflow status transitions
RequestAssignSerializer     — validates admin assignment
RequestActivitySerializer   — read-only activity log entries
"""

from rest_framework import serializers

from core.models import Request, RequestActivity, User


class RequestCreateSerializer(serializers.ModelSerializer):
    """Validates data for creating a new request (user-facing)."""

    priority = serializers.ChoiceField(
        choices=Request.Priority.choices,
        required=False,
        default=Request.Priority.MEDIUM,
    )

    class Meta:
        model = Request
        fields = ["title", "description", "priority"]

    def validate_title(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError("Title is required.")
        if len(value) > 255:
            raise serializers.ValidationError("Title must be 255 characters or fewer.")
        return value

    def validate_description(self, value):
        value = value.strip()
        if len(value) < 10:
            raise serializers.ValidationError(
                "Description must be at least 10 characters."
            )
        return value


class RequestSerializer(serializers.ModelSerializer):
    """Full read serializer — used in list and detail responses."""

    user_email = serializers.EmailField(source="user.email", read_only=True)
    assigned_to_email = serializers.SerializerMethodField()
    status_display = serializers.CharField(
        source="get_status_display", read_only=True
    )
    priority_display = serializers.CharField(
        source="get_priority_display", read_only=True
    )
    is_terminal = serializers.BooleanField(read_only=True)

    class Meta:
        model = Request
        fields = [
            "id",
            "title",
            "description",
            "status",
            "status_display",
            "priority",
            "priority_display",
            "user_email",
            "assigned_to",
            "assigned_to_email",
            "is_terminal",
            "created_at",
            "updated_at",
        ]
        read_only_fields = fields

    def get_assigned_to_email(self, obj):
        if obj.assigned_to:
            return obj.assigned_to.email
        return None


class RequestStatusSerializer(serializers.Serializer):
    """
    Validates admin status update payloads.

    Accepts any valid status — transition validation is enforced
    by the service layer (services.change_request_status).
    """

    status = serializers.ChoiceField(choices=Request.Status.choices)


class RequestAssignSerializer(serializers.Serializer):
    """
    Validates request assignment payloads.

    assigned_to can be a User ID (admin) or null to unassign.
    """

    assigned_to = serializers.IntegerField(required=False, allow_null=True)

    def validate_assigned_to(self, value):
        if value is None:
            return None
        try:
            user = User.objects.get(pk=value)
        except User.DoesNotExist:
            raise serializers.ValidationError(f"User with id={value} does not exist.")
        if not user.is_admin():
            raise serializers.ValidationError("Requests can only be assigned to admin users.")
        return value


class RequestActivitySerializer(serializers.ModelSerializer):
    """Read-only serializer for activity log entries."""

    performed_by_email = serializers.SerializerMethodField()
    action_display = serializers.CharField(
        source="get_action_display", read_only=True
    )

    class Meta:
        model = RequestActivity
        fields = [
            "id",
            "action",
            "action_display",
            "detail",
            "performed_by",
            "performed_by_email",
            "timestamp",
        ]
        read_only_fields = fields

    def get_performed_by_email(self, obj):
        if obj.performed_by:
            return obj.performed_by.email
        return None
