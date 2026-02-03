#!/usr/bin/env python
"""
Set Firebase Admin Custom Claim

This script sets the 'admin' custom claim for a Firebase user.
The user must already exist in Firebase Authentication.

Usage:
    python set_firebase_admin_claim.py <email_or_uid> [--revoke]

Examples:
    # Grant admin to user by email
    python set_firebase_admin_claim.py admin@example.com
    
    # Grant admin to user by UID
    python set_firebase_admin_claim.py abc123xyz
    
    # Revoke admin from user
    python set_firebase_admin_claim.py admin@example.com --revoke

Note: User must sign out and sign back in (or force token refresh) 
for the claim to take effect on the frontend.
"""

import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'helix_backend.settings')
django.setup()

from firebase_admin import auth
from authentication.firebase_auth import set_admin_claim, get_user_claims


def get_user_by_email_or_uid(identifier):
    """
    Get Firebase user by email or UID.
    """
    # Try as email first
    if '@' in identifier:
        try:
            return auth.get_user_by_email(identifier)
        except auth.UserNotFoundError:
            print(f"❌ No user found with email: {identifier}")
            return None
    
    # Try as UID
    try:
        return auth.get_user(identifier)
    except auth.UserNotFoundError:
        print(f"❌ No user found with UID: {identifier}")
        return None


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    
    identifier = sys.argv[1]
    revoke = '--revoke' in sys.argv
    
    # Get the user
    user = get_user_by_email_or_uid(identifier)
    if not user:
        sys.exit(1)
    
    print(f"\n👤 User found:")
    print(f"   Email: {user.email}")
    print(f"   UID: {user.uid}")
    print(f"   Display Name: {user.display_name or 'N/A'}")
    
    # Show current claims
    current_claims = user.custom_claims or {}
    print(f"   Current Claims: {current_claims}")
    
    # Set the admin claim
    is_admin = not revoke
    
    if revoke:
        print(f"\n🔄 Revoking admin access...")
    else:
        print(f"\n🔄 Granting admin access...")
    
    success = set_admin_claim(user.uid, is_admin=is_admin)
    
    if success:
        # Verify the change
        updated_user = auth.get_user(user.uid)
        new_claims = updated_user.custom_claims or {}
        
        if revoke:
            print(f"✅ Admin access revoked!")
        else:
            print(f"✅ Admin access granted!")
        
        print(f"   New Claims: {new_claims}")
        print(f"\n📌 Important: User must sign out and sign back in for changes to take effect.")
        
        # Also update the database Brand record
        try:
            from projects.models import Brand
            brand, created = Brand.objects.get_or_create(
                email=user.email,
                defaults={
                    'uid': user.uid,
                    'brand_name': user.display_name or user.email.split('@')[0],
                    'role': 'ADMIN' if is_admin else 'USER'
                }
            )
            if not created:
                brand.uid = user.uid
                brand.role = 'ADMIN' if is_admin else 'USER'
                brand.save()
            
            print(f"✅ Database Brand record updated: role={brand.role}")
        except Exception as e:
            print(f"⚠️  Warning: Could not update database Brand record: {e}")
    else:
        print(f"❌ Failed to set admin claim. Check logs for details.")
        sys.exit(1)


if __name__ == '__main__':
    main()
