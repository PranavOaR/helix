# Helix Backend Setup Instructions

Complete guide to set up and run the Helix Django backend with Firebase authentication.

## Prerequisites

- Python 3.10+ installed
- Firebase project with Authentication enabled
- Firebase service account credentials JSON file

## Quick Start

### 1. Python Environment Setup

```bash
# Navigate to backend directory
cd helix_backend

# Create virtual environment (if not exists)
python3 -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Project Settings** > **Service Accounts**
4. Click **Generate New Private Key**
5. Save the downloaded JSON file as `firebase-credentials.json` in the `helix_backend/` directory

**Important:** Never commit `firebase-credentials.json` to version control!

### 3. Database Setup

```bash
# Run migrations to create database tables
python manage.py migrate

# Create Django admin superuser (optional)
python manage.py createsuperuser
```

### 4. Start Development Server

```bash
# Start the Django development server
python manage.py runserver

# Server will be available at: http://127.0.0.1:8000
```

## Creating an Admin User for Frontend

To access the admin dashboard in the frontend (http://localhost:3000/admin), you need to:

### Method 1: Using Django Shell (Recommended)

```bash
python manage.py shell
```

Then in the Python shell:

```python
from projects.models import Brand

# Find your user by email (use the email you sign in with on frontend)
user = Brand.objects.get(email="your-email@gmail.com")

# Set role to ADMIN
user.role = 'ADMIN'
user.save()

# Verify
print(f"User {user.email} is now {user.role}")
exit()
```

### Method 2: Using Django Admin Panel

1. Go to http://127.0.0.1:8000/admin/
2. Log in with superuser credentials (created with `createsuperuser`)
3. Navigate to **Brands**
4. Find the user by email
5. Change their **Role** field to **ADMIN**
6. Click **Save**

### Method 3: Direct Database Update (SQLite)

```bash
# Open SQLite database
sqlite3 db.sqlite3

# View all users
SELECT id, email, brand_name, role FROM projects_brand;

# Update specific user to ADMIN
UPDATE projects_brand SET role='ADMIN' WHERE email='your-email@gmail.com';

# Verify
SELECT email, role FROM projects_brand WHERE email='your-email@gmail.com';

# Exit
.quit
```

## API Endpoints

### Public Endpoints

- `GET /api/projects/health/` - Health check (no auth)

### Authenticated Endpoints

- `POST /api/projects/create/` - Create new project
- `GET /api/projects/my-projects/` - Get user's projects
- `GET /api/projects/<id>/` - Get specific project
- `GET /api/projects/user/profile/` - Get user profile with role

### Admin-Only Endpoints

- `GET /api/projects/all/` - Get all projects
- `PATCH /api/projects/<id>/update-status/` - Update project status

## Testing the Setup

### 1. Test Health Check (No Auth)

```bash
curl http://127.0.0.1:8000/api/projects/health/
```

Expected response:
```json
{
  "status": "healthy",
  "message": "Helix API is running",
  "version": "Stage 1"
}
```

### 2. Test Authenticated Endpoint

First, get a Firebase ID token from your frontend by:
- Sign in at http://localhost:3000/auth
- Open browser console and run: `await firebase.auth().currentUser.getIdToken()`
- Copy the token

```bash
curl -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
     http://127.0.0.1:8000/api/projects/user/profile/
```

Expected response:
```json
{
  "email": "user@example.com",
  "brand_name": "User Brand",
  "role": "USER"
}
```

### 3. Verify Admin Access

After setting a user to ADMIN role, refresh the frontend and navigate to:
http://localhost:3000/admin

You should now see the admin dashboard.

## Project Structure

```
helix_backend/
├── manage.py              # Django management script
├── requirements.txt       # Python dependencies
├── db.sqlite3            # SQLite database
├── firebase-credentials.json  # Firebase service account (DO NOT COMMIT)
├── helix_backend/        # Main Django project
│   ├── settings.py       # Django settings
│   ├── urls.py          # URL routing
│   └── wsgi.py          # WSGI config
├── projects/             # Projects app
│   ├── models.py        # Database models (Brand, Project)
│   ├── views.py         # API endpoints
│   ├── serializers.py   # DRF serializers
│   ├── urls.py          # App URL routing
│   └── admin.py         # Django admin config
└── authentication/       # Firebase auth
    └── firebase_auth.py # Custom authentication backend
```

## Database Models

### Brand (User)
- `uid` - Firebase Authentication UID (unique)
- `brand_name` - Name of the brand/company
- `email` - Contact email
- `role` - USER or ADMIN
- `created_at` - Registration timestamp

### Project
- `brand` - Foreign key to Brand
- `service_type` - website, uiux, branding, app, canva
- `requirements_text` - Project requirements
- `status` - submitted, in_review, in_progress, completed, on_hold
- `created_at` - Submission timestamp

## Common Issues

### Issue: "command not found: python"
**Solution:** Use `python3` instead or configure Python environment properly

### Issue: "No module named 'firebase_admin'"
**Solution:** Ensure virtual environment is activated and run `pip install -r requirements.txt`

### Issue: "Firebase credentials not found"
**Solution:** Download Firebase service account JSON and save as `firebase-credentials.json` in backend root

### Issue: "CORS error" in frontend
**Solution:** Check that Django server is running and CORS is configured properly in settings.py

### Issue: "401 Unauthorized" on API calls
**Solution:** 
1. Ensure Firebase token is valid
2. Check that `firebase-credentials.json` is properly configured
3. Verify user is signed in on frontend

### Issue: Can't access admin dashboard
**Solution:** 
1. Ensure user role is set to 'ADMIN' in database
2. Log out and log back in on frontend to refresh token
3. Check browser console for errors

## Environment Variables (Optional)

Create a `.env` file for production configurations:

```env
DEBUG=False
SECRET_KEY=your-secret-key-here
DATABASE_NAME=helix_db
DATABASE_USER=postgres
DATABASE_PASSWORD=your-password
DATABASE_HOST=localhost
DATABASE_PORT=5432
```

## Production Deployment

For production:
1. Switch from SQLite to PostgreSQL
2. Set `DEBUG=False` in settings.py
3. Configure proper `ALLOWED_HOSTS`
4. Use environment variables for secrets
5. Set up proper HTTPS/SSL
6. Use a production WSGI server (Gunicorn)

## Support

For issues or questions:
- Check Django logs in terminal
- Review Firebase Authentication setup
- Verify database migrations are applied
- Check API endpoint responses

---

**Last Updated:** February 2026
