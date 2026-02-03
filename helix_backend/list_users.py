#!/usr/bin/env python
"""
List all users and their roles

This script lists all Brand records in the database along with 
their Firebase admin claim status (if available).

Usage:
    python list_users.py
"""

import os
import django
import sys

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'helix_backend.settings')
django.setup()

from firebase_admin import auth
from projects.models import Brand


def main():
    print("\n" + "="*70)
    print("📋 HELIX USER LIST")
    print("="*70 + "\n")
    
    brands = Brand.objects.all().order_by('-role', 'email')
    
    if not brands.exists():
        print("No users found in database.")
        print("\nRun 'python create_special_accounts.py' to create initial accounts.")
        return
    
    for brand in brands:
        emoji = "👑" if brand.role == 'ADMIN' else "👤"
        print(f"{emoji} {brand.email}")
        print(f"   Brand Name: {brand.brand_name}")
        print(f"   Database Role: {brand.role}")
        print(f"   UID: {brand.uid[:20]}..." if len(brand.uid) > 20 else f"   UID: {brand.uid}")
        
        # Check Firebase claims if possible
        try:
            # Only check if UID looks like a real Firebase UID (not placeholder)
            if not brand.uid.startswith('placeholder-'):
                firebase_user = auth.get_user(brand.uid)
                claims = firebase_user.custom_claims or {}
                is_firebase_admin = claims.get('admin', False)
                print(f"   Firebase Admin Claim: {'✅ Yes' if is_firebase_admin else '❌ No'}")
            else:
                print(f"   Firebase Admin Claim: ⚠️  User not yet signed up")
        except auth.UserNotFoundError:
            print(f"   Firebase Admin Claim: ⚠️  UID not found in Firebase")
        except Exception as e:
            print(f"   Firebase Admin Claim: ⚠️  Could not check ({type(e).__name__})")
        
        print()
    
    print("="*70)
    print(f"Total: {brands.count()} users")
    print(f"Admins: {brands.filter(role='ADMIN').count()}")
    print(f"Users: {brands.filter(role='USER').count()}")
    print("="*70)


if __name__ == '__main__':
    main()
