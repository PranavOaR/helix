# Helix Platform - Stage 1 Backend

Django REST API backend for Helix client service portal with Firebase authentication.

## 🎯 Stage 1 Features

✅ Firebase ID Token Authentication  
✅ Brand Management (linked to Firebase UID)  
✅ Project Request System  
✅ Secure API Endpoints  
✅ Django Admin Interface  

## 🚀 API Endpoints

### Health Check
```
GET /api/projects/health/
```
No authentication required. Returns API status.

### Create Project
```
POST /api/projects/create/
Authorization: Bearer <firebase_token>

Body:
{
  "service_type": "website",
  "requirements_text": "I need a Shopify store..."
}
```

### Get My Projects
```
GET /api/projects/my-projects/
Authorization: Bearer <firebase_token>
```

### Get Project Detail
```
GET /api/projects/<project_id>/
Authorization: Bearer <firebase_token>
```

## 📊 Database Models

### Brand
- `uid` - Firebase Authentication UID (unique)
- `brand_name` - Name of the brand/company
- `email` - Contact email from Firebase
- `created_at` - Registration timestamp

### Project
- `brand` - ForeignKey to Brand
- `service_type` - website, uiux, branding, app, canva
- `requirements_text` - Detailed requirements
- `status` - submitted, in_review, in_progress, completed, on_hold
- `created_at` - Submission timestamp

## 🔐 Security

- Firebase Admin SDK verifies all authentication tokens
- Brands can only access their own projects
- Django Admin requires superuser authentication
- CORS configured for Next.js frontend

## 🛠 Tech Stack

- Django 5.0
- Django REST Framework
- Firebase Admin SDK
- PostgreSQL / SQLite
- Python 3.10+

## 📝 License

Private - Helix Platform
