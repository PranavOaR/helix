# Helix Platform - Quick Start Guide

Full-stack application with Next.js frontend and Django backend.

## 🚀 Running the Application

### Backend Setup (First Time Only)

1. **Navigate to backend:**
   ```bash
   cd helix_backend
   ```

2. **Install dependencies:**
   ```bash
   # Virtual environment should be in parent directory
   pip install -r requirements.txt
   ```

3. **Apply database migrations:**
   ```bash
   python manage.py migrate
   ```

4. **Add Firebase credentials:**
   - Download your Firebase service account JSON from Firebase Console
   - Save it as `helix_backend/firebase-credentials.json`

### Frontend Setup (First Time Only)

1. **Navigate to project root:**
   ```bash
   cd ..  # Back to helix/
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Firebase:**
   - Add your Firebase config to `src/lib/firebase.ts`

## 🏃 Running Both Servers

The project is already running! Check:
- **Frontend:** http://localhost:3000
- **Backend:** http://127.0.0.1:8000
- **Backend Admin:** http://127.0.0.1:8000/admin

If you need to restart:

```bash
# Terminal 1 - Backend
cd helix_backend
python manage.py runserver

# Terminal 2 - Frontend
npm run dev
```

## 👑 Setting Up Admin Access

To access the admin dashboard at http://localhost:3000/admin:

### Step 1: Sign in to the application
1. Go to http://localhost:3000/auth
2. Sign in with Google

### Step 2: Set your user as ADMIN

**Option A - Using the helper script (Easiest):**
```bash
cd helix_backend
python set_admin.py your-email@gmail.com
```

**Option B - Using Django shell:**
```bash
cd helix_backend
python manage.py shell
```
Then:
```python
from projects.models import Brand
user = Brand.objects.get(email="your-email@gmail.com")
user.role = 'ADMIN'
user.save()
exit()
```

**Option C - Using Django admin panel:**
1. Create a superuser: `python manage.py createsuperuser`
2. Go to http://127.0.0.1:8000/admin
3. Log in and find your user under Brands
4. Change role to ADMIN

### Step 3: Refresh the frontend
- Log out and log back in at http://localhost:3000/auth
- Navigate to http://localhost:3000/admin

## 📁 Project Structure

```
helix/
├── helix_backend/          # Django REST API
│   ├── manage.py
│   ├── requirements.txt
│   ├── set_admin.py       # Helper script to set admin users
│   ├── SETUP_INSTRUCTIONS.md  # Detailed backend setup
│   └── projects/          # Main app (API endpoints)
├── src/                   # Next.js frontend
│   ├── app/              # App router pages
│   ├── components/       # React components
│   ├── context/          # Auth & Theme contexts
│   └── lib/              # API & utilities
├── package.json
└── README.md
```

## 🔗 Available Routes

### Frontend Routes
- `/` - Landing page
- `/auth` - Sign in with Google
- `/dashboard` - User dashboard (authenticated)
- `/dashboard/requests` - View your requests
- `/dashboard/service/:id` - Request a service
- `/admin` - Admin dashboard (ADMIN role only)

### Backend API Endpoints
- `GET /api/projects/health/` - Health check
- `POST /api/projects/create/` - Create project
- `GET /api/projects/my-projects/` - Get user's projects
- `GET /api/projects/user/profile/` - Get user profile with role
- `GET /api/projects/all/` - Get all projects (admin only)
- `PATCH /api/projects/:id/update-status/` - Update status (admin only)

## 🛠 Useful Commands

```bash
# List all registered users
cd helix_backend
python set_admin.py --list

# Set a user as admin
python set_admin.py user@example.com

# Create Django superuser
python manage.py createsuperuser

# View database (SQLite)
sqlite3 helix_backend/db.sqlite3
```

## ❓ Troubleshooting

### Can't access admin dashboard?
1. Ensure you're logged in
2. Check that your email is set to role='ADMIN' in database
3. Log out and log back in to refresh your session
4. Check browser console for errors

### Backend not connecting?
1. Ensure Django server is running on port 8000
2. Check `firebase-credentials.json` exists
3. Verify CORS settings in `helix_backend/helix_backend/settings.py`

### Frontend build errors?
1. Delete `node_modules` and `.next` folders
2. Run `npm install` again
3. Check that all environment variables are set

### "401 Unauthorized" errors?
1. Ensure you're signed in on the frontend
2. Check Firebase configuration matches between frontend and backend
3. Try logging out and back in

## 📚 Documentation

- Backend setup: `helix_backend/SETUP_INSTRUCTIONS.md`
- Backend API: `helix_backend/README.md`

## 🎯 Next Steps

1. ✅ Sign in at http://localhost:3000/auth
2. ✅ Set your user as ADMIN using `python set_admin.py your-email@gmail.com`
3. ✅ Access admin dashboard at http://localhost:3000/admin
4. ✅ Test creating a service request as a regular user
5. ✅ Update request statuses from the admin dashboard

---

**Need help?** Check the detailed setup instructions in `helix_backend/SETUP_INSTRUCTIONS.md`
