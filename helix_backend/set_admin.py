#!/usr/bin/env python
"""
Helper script to set a user as ADMIN in the Helix backend.

Usage:
    python set_admin.py user@example.com
"""

import sys
import os
import django

# Setup Django environment
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'helix_backend.settings')
django.setup()

from projects.models import Brand


def set_admin(email):
    """Set a user as ADMIN by their email address."""
    try:
        # Find user by email
        brand = Brand.objects.get(email=email)
        
        # Check current role
        old_role = brand.role
        
        # Set to ADMIN
        brand.role = 'ADMIN'
        brand.save()
        
        print(f"✅ Success!")
        print(f"   User: {brand.brand_name} ({brand.email})")
        print(f"   Role changed: {old_role} → ADMIN")
        print(f"\n📌 The user can now access the admin dashboard at http://localhost:3000/admin")
        print(f"   (They may need to log out and log back in)")
        
    except Brand.DoesNotExist:
        print(f"❌ Error: No user found with email '{email}'")
        print(f"\n💡 Tips:")
        print(f"   1. Make sure the user has signed in at least once")
        print(f"   2. Check the email matches exactly (case-sensitive)")
        print(f"   3. View all users: python list_users.py")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        sys.exit(1)


def list_all_users():
    """List all registered users."""
    brands = Brand.objects.all().order_by('-created_at')
    
    if not brands:
        print("No users found in database.")
        return
    
    print(f"\n📋 Registered Users ({brands.count()}):")
    print("-" * 80)
    
    for brand in brands:
        role_emoji = "👑" if brand.role == 'ADMIN' else "👤"
        print(f"{role_emoji} {brand.email:40} | {brand.role:8} | {brand.brand_name}")
    
    print("-" * 80)


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Helix Admin User Setup\n")
        print("Usage:")
        print("  python set_admin.py <email>           - Set user as ADMIN")
        print("  python set_admin.py --list            - List all users")
        print("\nExample:")
        print("  python set_admin.py user@example.com")
        sys.exit(1)
    
    if sys.argv[1] == '--list':
        list_all_users()
    else:
        email = sys.argv[1]
        set_admin(email)
