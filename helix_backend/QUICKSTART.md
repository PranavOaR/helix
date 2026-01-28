# Quick Start Guide - Helix Backend

## Immediate Action Items for Pranav

### 1️⃣ Download Firebase Credentials (CRITICAL)

🔴 **You MUST do this first:**

1. Go to https://console.firebase.google.com
2. Select your project
3. Settings ⚙️ > Service Accounts
4. "Generate New Private Key" button
5. Download the JSON file
6. Rename to: `firebase-credentials.json`
7. Place in: `/Users/pranavrao/Documents/helix/helix/helix_backend/`

### 2️⃣ Run Setup Commands

```bash
# Go to backend directory
cd /Users/pranavrao/Documents/helix/helix/helix_backend

# Create virtual environment
python3 -m venv venv

# Activate it
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Generate secret key and copy it
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"

# Edit .env and paste the secret key
# nano .env  (or use VS Code)

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create admin user
python manage.py createsuperuser

# Start server
python manage.py runserver 8000
```

### 3️⃣ Test It Works

```bash
# Test health check
curl http://localhost:8000/api/projects/health/

# Visit admin panel
# Open: http://localhost:8000/admin/
```

✅ Done! Backend is ready for frontend integration.

---

## Frontend API Integration Example

```javascript
// In your Next.js frontend

import { getAuth } from 'firebase/auth';

// Create Project
const createProject = async (serviceType, requirements) => {
  const auth = getAuth();
  const token = await auth.currentUser.getIdToken();
  
  const res = await fetch('http://localhost:8000/api/projects/create/', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      service_type: serviceType,  // 'website' | 'uiux' | 'branding' | 'app' | 'canva'
      requirements_text: requirements
    })
  });
  
  return await res.json();
};

// Get My Projects
const getProjects = async () => {
  const auth = getAuth();
  const token = await auth.currentUser.getIdToken();
  
  const res = await fetch('http://localhost:8000/api/projects/my-projects/', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return await res.json();
};
```

---

See `SETUP_INSTRUCTIONS.md` for detailed documentation.
