"""
Database Models for Helix Platform — Phase 2

User            — linked to Firebase Authentication via UID
Request         — service/feature requests with workflow states
RequestActivity — audit log for all request actions
"""

from django.db import models


class User(models.Model):
    """
    User model linked to Firebase Authentication.

    Each user is uniquely identified by their Firebase UID.
    The model is returned directly by FirebaseAuthentication as request.user,
    so it implements is_authenticated to satisfy DRF's permission checks.
    """

    class Role(models.TextChoices):
        USER = "USER", "User"
        ADMIN = "ADMIN", "Admin"

    uid = models.CharField(
        max_length=128,
        unique=True,
        db_index=True,
        help_text="Firebase Authentication UID",
    )
    email = models.EmailField(
        unique=True,
        help_text="User email from Firebase Auth",
    )
    role = models.CharField(
        max_length=10,
        choices=Role.choices,
        default=Role.USER,
        help_text="Authorization role",
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Whether the user account is active",
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="When the user was first created",
    )

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "User"
        verbose_name_plural = "Users"

    def __str__(self):
        return f"{self.email} ({self.role})"

    # ── DRF compatibility ─────────────────────────────────────────
    @property
    def is_authenticated(self):
        """Always True for persisted users. Required by DRF permissions."""
        return True

    def is_admin(self):
        """Check if this user has admin privileges."""
        return self.role == self.Role.ADMIN


class Request(models.Model):
    """
    Request model — represents a service/feature request submitted by a user.

    Workflow states (Phase 2):
        PENDING → REVIEWING → IN_PROGRESS → COMPLETED → DELIVERED → CLOSED
                          ↘ REJECTED
        CANCELLED can be reached from any non-terminal state.
    """

    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        REVIEWING = "REVIEWING", "Reviewing"
        IN_PROGRESS = "IN_PROGRESS", "In Progress"
        COMPLETED = "COMPLETED", "Completed"
        DELIVERED = "DELIVERED", "Delivered"
        CLOSED = "CLOSED", "Closed"
        REJECTED = "REJECTED", "Rejected"
        CANCELLED = "CANCELLED", "Cancelled"

    class Priority(models.TextChoices):
        LOW = "LOW", "Low"
        MEDIUM = "MEDIUM", "Medium"
        HIGH = "HIGH", "High"
        URGENT = "URGENT", "Urgent"

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="requests",
        help_text="User who submitted this request",
    )
    title = models.CharField(
        max_length=255,
        help_text="Short title for the request",
    )
    description = models.TextField(
        help_text="Detailed description of the request",
    )
    status = models.CharField(
        max_length=12,
        choices=Status.choices,
        default=Status.PENDING,
        help_text="Current workflow status",
    )
    priority = models.CharField(
        max_length=6,
        choices=Priority.choices,
        default=Priority.MEDIUM,
        help_text="Request priority level",
    )
    assigned_to = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="assigned_requests",
        help_text="Admin user assigned to handle this request",
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="When the request was created",
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="When the request was last updated",
    )

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Request"
        verbose_name_plural = "Requests"
        indexes = [
            models.Index(fields=["user", "status"]),
            models.Index(fields=["status"]),
            models.Index(fields=["assigned_to"]),
            models.Index(fields=["created_at"]),
        ]

    def __str__(self):
        return f"{self.title} — {self.status} (by {self.user.email})"

    @property
    def is_terminal(self):
        """Check if the request is in a terminal (final) state."""
        return self.status in (
            self.Status.CLOSED,
            self.Status.REJECTED,
            self.Status.CANCELLED,
        )


class RequestActivity(models.Model):
    """
    Audit log entry for request actions.

    Automatically created by the service layer whenever a request
    is created, status-changed, assigned, delivered, or closed.
    """

    class Action(models.TextChoices):
        CREATED = "CREATED", "Created"
        STATUS_CHANGED = "STATUS_CHANGED", "Status Changed"
        ASSIGNED = "ASSIGNED", "Assigned"
        UNASSIGNED = "UNASSIGNED", "Unassigned"

    request = models.ForeignKey(
        Request,
        on_delete=models.CASCADE,
        related_name="activities",
        help_text="The request this activity belongs to",
    )
    action = models.CharField(
        max_length=20,
        choices=Action.choices,
        help_text="Type of action performed",
    )
    detail = models.TextField(
        blank=True,
        default="",
        help_text="Human-readable description of the action",
    )
    performed_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name="performed_activities",
        help_text="User who performed this action",
    )
    timestamp = models.DateTimeField(
        auto_now_add=True,
        help_text="When the action occurred",
    )

    class Meta:
        ordering = ["-timestamp"]
        verbose_name = "Request Activity"
        verbose_name_plural = "Request Activities"
        indexes = [
            models.Index(fields=["request", "timestamp"]),
        ]

    def __str__(self):
        return f"{self.action} on {self.request.title} by {self.performed_by}"
