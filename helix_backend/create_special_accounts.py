import os
import django
import sys

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'helix_backend.settings')
django.setup()

from projects.models import Brand

# Create or update special accounts
accounts = [
    {
        'uid': 'special-admin-shashi',
        'email': 'shashiii3110@helix.com',
        'brand_name': 'Helix Admin - Shashi',
        'role': 'ADMIN'
    },
    {
        'uid': 'special-user-shashi',
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
print("\n📌 Important Notes:")
print("   1. These accounts need to sign up with Firebase using these emails")
print("   2. They can use email/password or Google sign-in")
print("   3. Once signed in, they'll automatically get their assigned roles")
print("   4. Admin: shashiii3110@helix.com")
print("   5. User: shashiii3111@helix.com")
