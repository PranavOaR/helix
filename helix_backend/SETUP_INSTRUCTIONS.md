# SETUP INSTRUCTIONS FOR HELIX BACKEND - STAGE 1

## 📋 Prerequisites

- Python 3.10 or higher installed
- Firebase project with Authentication enabled
- Git installed

---

## 🚀 STEP-BY-STEP SETUP

### STEP 1: Navigate to Backend Directory

```bash
cd /Users/pranavrao/Documents/helix/helix/helix_backend
```

---

### STEP 2: Create Python Virtual Environment

**Pranav, you need to create a virtual environment for the backend:**

```bash
python3 -m venv venv
```

Then activate it:

```bash
source venv/bin/activate
```

You should see `(venv)` appear in your terminal prompt.

---

### STEP 3: Install Python Dependencies

**Pranav, install all required packages:**

```bash
pip install -r requirements.txt
```

This installs:
- Django
- Django REST Framework
- Firebase Admin SDK
- django-cors-headers
- psycopg2 (for PostgreSQL, optional)
- python-decouple (for environment variables)

---

### STEP 4: Download Firebase Admin SDK Credentials

**⚠️ CRITICAL STEP - Pranav, you MUST do this:**

1. Go to Firebase Console: https://console.firebase.google.com
2. Select your Helix project
3. Click the gear icon ⚙️ > Project Settings
4. Go to "Service Accounts" tab
5. Click "Generate New Private Key"
6. Download the JSON file
7. **Rename it to `firebase-credentials.json`**
8. **Place it in `/Users/pranavrao/Documents/helix/helix/helix_backend/`**

⚠️ The file should be at:
```
/Users/pranavrao/Documents/helix/helix/helix_backend/firebase-credentials.json
```

⚠️ **NEVER commit this file to Git** (already in .gitignore)

---

### STEP 5: Create Environment File

**Pranav, create a `.env` file:**

```bash
cp .env.example .env
```

Then edit `.env` and update these values:

```env
# Generate a new secret key:
SECRET_KEY=your-random-secret-key-here-make-it-long-and-random

DEBUG=True

ALLOWED_HOSTS=localhost,127.0.0.1

# For local development (SQLite):
DATABASE_ENGINE=django.db.backends.sqlite3
DATABASE_NAME=db.sqlite3

# Firebase credentials path
FIREBASE_CREDENTIALS_PATH=firebase-credentials.json

# CORS for your Next.js frontend
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

To generate a secure SECRET_KEY, run:

```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

Copy the output and paste it as your SECRET_KEY in `.env`.

---

### STEP 6: Run Database Migrations

**Pranav, create the database tables:**

```bash
python manage.py makemigrations
python manage.py migrate
```

This creates:
- Brand table
- Project table
- Django's built-in tables (users, sessions, etc.)

---

### STEP 7: Create Django Superuser

**Pranav, create an admin account for Django Admin:**

```bash
python manage.py createsuperuser
```

You'll be asked to enter:
- Username (e.g., admin)
- Email
- Password (enter it twice)

Remember these credentials - you'll use them to access Django Admin.

---

### STEP 8: Start the Development Server

**Pranav, start the backend server:**

```bash
python manage.py runserver 8000
```

You should see:
```
Starting development server at http://127.0.0.1:8000/
```

✅ Backend is now running!

---

## ✅ VERIFY SETUP

### Test 1: Health Check

Open your browser or use curl:

```bash
curl http://localhost:8000/api/projects/health/
```

Expected response:
```json
{
  "status": "healthy",
  "message": "Helix API is running",
  "version": "Stage 1"
}
```

### Test 2: Django Admin

1. Go to: http://localhost:8000/admin/
2. Login with your superuser credentials
3. You should see "Brands" and "Projects" sections

✅ If both tests pass, your backend is ready!

---

## 🔗 FRONTEND INTEGRATION

**Pranav, tell your frontend developers to:**

### 1. Get Firebase ID Token

After user signs in with Firebase Auth:

```javascript
import { getAuth } from 'firebase/auth';

const auth = getAuth();
const user = auth.currentUser;

if (user) {
  const token = await user.getIdToken();
  // Use this token in API calls
}
```

### 2. Create Project API Call

```javascript
const createProject = async (serviceType, requirements) => {
  const auth = getAuth();
  const token = await auth.currentUser.getIdToken();
  
  const response = await fetch('http://localhost:8000/api/projects/create/', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      service_type: serviceType,  // 'website', 'uiux', 'branding', 'app', 'canva'
      requirements_text: requirements
    })
  });
  
  const data = await response.json();
  return data;
};
```

### 3. Get My Projects API Call

```javascript
const getMyProjects = async () => {
  const auth = getAuth();
  const token = await auth.currentUser.getIdToken();
  
  const response = await fetch('http://localhost:8000/api/projects/my-projects/', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const data = await response.json();
  return data.projects;
};
```

---

## 🐛 TROUBLESHOOTING

### Error: "Firebase Admin SDK initialization failed"

**Solution:** Make sure `firebase-credentials.json` exists in the backend root directory.

```bash
ls -la /Users/pranavrao/Documents/helix/helix/helix_backend/firebase-credentials.json
```

If it doesn't exist, go back to STEP 4.

---

### Error: "No module named 'rest_framework'"

**Solution:** Activate virtual environment and install dependencies:

```bash
source venv/bin/activate
pip install -r requirements.txt
```

---

### Error: "CORS error" from frontend

**Solution:** Check your `.env` file has the correct frontend URL:

```env
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

Match this to your Next.js dev server URL.

---

### Error: "Invalid Firebase ID token"

**Solution:** 
1. Check that frontend is using the same Firebase project
2. Make sure token is being sent in header: `Authorization: Bearer <token>`
3. Token might be expired - get a fresh token from Firebase

---

## 📁 PROJECT STRUCTURE

```
helix_backend/
├── manage.py                 # Django management script
├── requirements.txt          # Python dependencies
├── .env                      # Environment variables (create this)
├── .env.example             # Example environment file
├── firebase-credentials.json # Firebase Admin SDK key (download this)
├── db.sqlite3               # SQLite database (created after migrations)
│
├── helix_backend/           # Main Django project
│   ├── __init__.py
│   ├── settings.py          # Django settings
│   ├── urls.py              # Main URL configuration
│   ├── wsgi.py
│   └── asgi.py
│
├── authentication/          # Firebase authentication app
│   ├── __init__.py
│   ├── apps.py
│   └── firebase_auth.py     # FirebaseAuthentication class
│
└── projects/                # Projects app
    ├── __init__.py
    ├── apps.py
    ├── models.py            # Brand & Project models
    ├── serializers.py       # DRF serializers
    ├── views.py             # API endpoints
    ├── urls.py              # Projects URL routing
    └── admin.py             # Django admin configuration
```

---

## 🎯 WHAT'S BEEN IMPLEMENTED

✅ Django project with REST Framework  
✅ Firebase Admin SDK integration  
✅ FirebaseAuthentication class for token verification  
✅ Brand model (linked to Firebase UID)  
✅ Project model (service requests)  
✅ POST /api/projects/create/ endpoint  
✅ GET /api/projects/my-projects/ endpoint  
✅ GET /api/projects/<id>/ endpoint  
✅ Django Admin interface  
✅ CORS configuration for Next.js  
✅ Proper error handling  
✅ Database migrations  

---

## 🚀 NEXT STEPS (After Setup)

1. **Test with Postman/Thunder Client:**
   - First get a Firebase token from your frontend
   - Test the create and get endpoints
   - Verify only your projects are returned

2. **Connect Frontend:**
   - Update frontend API calls to use `http://localhost:8000`
   - Implement the integration code shown above
   - Test end-to-end flow

3. **Deploy to Production (Future):**
   - Switch to PostgreSQL database
   - Set DEBUG=False
   - Use environment variables for secrets
   - Deploy to Railway, Heroku, or AWS

---

## 📞 SUPPORT

If you encounter any issues:

1. Check the error message carefully
2. Review the troubleshooting section above
3. Verify all steps were completed in order
4. Check Django logs in terminal where server is running

---

**Pranav, you're all set! Start with STEP 1 and work through each step.**

**The backend is production-ready for Stage 1. Once setup is complete, test the health endpoint and then connect your Next.js frontend.**

Good luck! 🚀
