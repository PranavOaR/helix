import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'helix_backend.settings')
django.setup()

from projects.models import Brand

uid = 'tyJmvo0r21bqfiVfbrd5VrJz1uH3'

try:
    user = Brand.objects.get(uid=uid)
    print(f'✅ Found user: {user.email}')
    print(f'   Brand: {user.brand_name}')
    print(f'   Current Role: {user.role}')
    
    user.role = 'ADMIN'
    user.save()
    
    print(f'\n🎉 SUCCESS! You are now ADMIN!')
    print(f'\n📌 Next steps:')
    print(f'   1. Log out at http://localhost:3000')
    print(f'   2. Log back in')
    print(f'   3. Visit http://localhost:3000/admin')
    
except Brand.DoesNotExist:
    print(f'❌ User still not found. Try refreshing the page.')
