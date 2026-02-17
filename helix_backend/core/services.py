"""
Service Layer for Helix Platform — Phase 2

All business logic lives here. Views call these functions
instead of containing logic directly.

Functions:
    create_request()          — create + log CREATED
    change_request_status()   — validate transition + log STATUS_CHANGED
    assign_request()          — set assigned_to + log ASSIGNED
    log_activity()            — create RequestActivity record
"""

import logging

from django.core.exceptions import ValidationError

from core.models import Request, RequestActivity, User

logger = logging.getLogger(__name__)

# ═══════════════════════════════════════════════════════════════════
#  Workflow Transition Map
# ═══════════════════════════════════════════════════════════════════

TRANSITIONS = {
    Request.Status.PENDING: [
        Request.Status.REVIEWING,
        Request.Status.REJECTED,
        Request.Status.CANCELLED,
    ],
    Request.Status.REVIEWING: [
        Request.Status.IN_PROGRESS,
        Request.Status.REJECTED,
        Request.Status.CANCELLED,
    ],
    Request.Status.IN_PROGRESS: [
        Request.Status.COMPLETED,
        Request.Status.CANCELLED,
    ],
    Request.Status.COMPLETED: [
        Request.Status.DELIVERED,
    ],
    Request.Status.DELIVERED: [
        Request.Status.CLOSED,
    ],
    # Terminal states — no outgoing transitions
    Request.Status.CLOSED: [],
    Request.Status.REJECTED: [],
    Request.Status.CANCELLED: [],
}


def _validate_transition(current_status, new_status):
    """
    Validate that a status transition is allowed.

    Raises:
        ValidationError if the transition is not permitted.
    """
    allowed = TRANSITIONS.get(current_status, [])
    if new_status not in allowed:
        allowed_display = ", ".join(allowed) if allowed else "none (terminal state)"
        raise ValidationError(
            f"Cannot transition from {current_status} to {new_status}. "
            f"Allowed transitions: {allowed_display}"
        )


# ═══════════════════════════════════════════════════════════════════
#  Service Functions
# ═══════════════════════════════════════════════════════════════════


def log_activity(request_obj, action, performed_by, detail=""):
    """
    Create a RequestActivity audit log entry.

    Args:
        request_obj: Request instance
        action: RequestActivity.Action value
        performed_by: User who performed the action
        detail: Human-readable description
    """
    activity = RequestActivity.objects.create(
        request=request_obj,
        action=action,
        detail=detail,
        performed_by=performed_by,
    )
    logger.info(
        f"[ACTIVITY] {action} on request id={request_obj.id} by {performed_by.email}: {detail}"
    )
    return activity


def create_request(user, title, description, priority=None):
    """
    Create a new request and log the CREATED activity.

    Args:
        user: User creating the request
        title: Request title
        description: Request description
        priority: Optional priority level (defaults to MEDIUM)

    Returns:
        Request: The newly created request
    """
    kwargs = {
        "user": user,
        "title": title,
        "description": description,
    }
    if priority:
        kwargs["priority"] = priority

    request_obj = Request.objects.create(**kwargs)

    log_activity(
        request_obj=request_obj,
        action=RequestActivity.Action.CREATED,
        performed_by=user,
        detail=f"Request '{title}' created with priority {request_obj.priority}",
    )

    logger.info(f"[SERVICE] Request id={request_obj.id} created by {user.email}")
    return request_obj


def change_request_status(request_obj, new_status, changed_by):
    """
    Change the status of a request with transition validation.

    Args:
        request_obj: Request instance
        new_status: Target status (must be a valid Request.Status value)
        changed_by: User performing the change

    Returns:
        Request: The updated request

    Raises:
        ValidationError: If the transition is not allowed
    """
    old_status = request_obj.status
    _validate_transition(old_status, new_status)

    request_obj.status = new_status
    request_obj.save(update_fields=["status", "updated_at"])

    log_activity(
        request_obj=request_obj,
        action=RequestActivity.Action.STATUS_CHANGED,
        performed_by=changed_by,
        detail=f"Status changed from {old_status} to {new_status}",
    )

    logger.info(
        f"[SERVICE] Request id={request_obj.id} status: {old_status} → {new_status} "
        f"by {changed_by.email}"
    )
    return request_obj


def assign_request(request_obj, admin_user, assigned_by):
    """
    Assign a request to an admin user.

    Args:
        request_obj: Request instance
        admin_user: User (with ADMIN role) to assign, or None to unassign
        assigned_by: User performing the assignment

    Returns:
        Request: The updated request

    Raises:
        ValidationError: If the request is in a terminal state,
                         or admin_user is not an admin
    """
    if request_obj.is_terminal:
        raise ValidationError(
            f"Cannot assign a request in terminal state ({request_obj.status})."
        )

    if admin_user is not None and not admin_user.is_admin():
        raise ValidationError("Requests can only be assigned to admin users.")

    old_assignee = request_obj.assigned_to
    request_obj.assigned_to = admin_user
    request_obj.save(update_fields=["assigned_to", "updated_at"])

    if admin_user:
        log_activity(
            request_obj=request_obj,
            action=RequestActivity.Action.ASSIGNED,
            performed_by=assigned_by,
            detail=f"Assigned to {admin_user.email}",
        )
    else:
        log_activity(
            request_obj=request_obj,
            action=RequestActivity.Action.UNASSIGNED,
            performed_by=assigned_by,
            detail=f"Unassigned from {old_assignee.email if old_assignee else 'nobody'}",
        )

    logger.info(
        f"[SERVICE] Request id={request_obj.id} assigned to "
        f"{admin_user.email if admin_user else 'nobody'} by {assigned_by.email}"
    )
    return request_obj
