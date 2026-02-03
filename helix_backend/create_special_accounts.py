"""
Create Special Accounts for Helix Platform

This script creates Brand records in the database with pre-assigned roles.
When users sign up with these emails via Firebase, they will automatically
get the correct role.

For admin users, you should also run set_firebase_admin_claim.py after
the user has signed up to set the Firebase custom claim.

Usage:
    python create_special_accounts.py
"""

import os
import django
import sys

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'helix_backend.settings')
django.setup()

from projects.models import Brand

# Create or update special accounts
# Note: The 'uid' will be updated when the user actually signs in via Firebase
accounts = [
    {
        'uid': 'placeholder-admin-shashi',  # Will be updated on first login
        'email': 'shashiii3110@helix.com',
        'brand_name': 'Helix Admin - Shashi',
        'role': 'ADMIN'
    },
    {
        'uid': 'placeholder-user-shashi',  # Will be updated on first login
        'email': 'shashiii3111@helix.com',
        'brand_name': 'Helix User - Shashi',
        'role': 'USER'
    }
]

print("Creating special login accounts...\n")

for account in accounts:
    brand, created = Brand.objects.update_or_create(
        email=account['email'],
        defaults={
            'uid': account['uid'],
            'brand_name': account['brand_name'],
            'role': account['role']
        }
    )
    
    status = "Created" if created else "Updated"
    emoji = "👑" if account['role'] == 'ADMIN' else "👤"
    
    print(f"{emoji} {status}: {brand.email}")
    print(f"   Brand: {brand.brand_name}")
    print(f"   Role: {brand.role}")
    print(f"   Status: Ready for Firebase sign-in\n")

print("✅ Special accounts created successfully!")
print("\n" + "="*60)
print("📌 IMPORTANT NEXT STEPS:")
print("="*60)
print("""
1. Have the admin user sign up in Firebase:
   - Go to the app and sign up with: shashiii3110@helix.com
   - Use email/password or Google (must use same email)

2. After the admin signs up, set Firebase custom claim:
   python set_firebase_admin_claim.py shashiii3110@helix.com

3. The admin must sign out and sign back in for the claim to take effect.

4. User accounts work automatically - just sign up with the email.
""")
print("="*60)
