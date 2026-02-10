"""
Core constants for Helix backend application.
Provides single source of truth for role definitions and other constants.
"""


class Roles:
    """User role constants."""
    USER = "USER"
    ADMIN = "ADMIN"

    CHOICES = (
        (USER, "User"),
        (ADMIN, "Admin"),
    )
