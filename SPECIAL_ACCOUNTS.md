# Special Login Accounts

Pre-configured accounts with assigned roles.

## Admin Account
- **Email:** shashiii3110@helix.com
- **Password:** Admin@123456
- **Role:** ADMIN
- **Access:** Full admin dashboard access

## User Account
- **Email:** shashiii3111@helix.com
- **Password:** User@123456
- **Role:** USER
- **Access:** Regular user dashboard

## How to Use

### First Time Setup (REQUIRED)
**⚠️ Important: You must SIGN UP first, not login!**

1. Go to http://localhost:3000/auth
2. **Click the "Sign Up" tab** (not Login)
3. Fill in the form:
   - **Admin Account:**
     - Email: `shashiii3110@helix.com`
     - Password: `Admin@123456`
     - Brand Name: `Helix Admin - Shashi`
   
   - **User Account:**
     - Email: `shashiii3111@helix.com`
     - Password: `User@123456`
     - Brand Name: `Helix User - Shashi`

4. Click "Create Account"
5. The system will automatically assign the pre-configured role from the database

### Subsequent Logins
After signing up, you can login with:
- **Admin Login:** shashiii3110@helix.com / Admin@123456
- **User Login:** shashiii3111@helix.com / User@123456

## What Each Role Can Do

### ADMIN (shashiii3110@helix.com)
✅ Access admin dashboard at `/admin`
✅ View all user requests
✅ Update project statuses
✅ Manage all projects
✅ Full system access

### USER (shashiii3111@helix.com)
✅ Access user dashboard at `/dashboard`
✅ Create service requests
✅ View own projects only
✅ Track request status

## Testing the Accounts

1. **Test Admin Login:**
   ```
   Email: shashiii3110@helix.com
   Password: (create during first sign-up)
   Expected: Access to /admin with full controls
   ```

2. **Test User Login:**
   ```
   Email: shashiii3111@helix.com
   Password: (create during first sign-up)
   Expected: Access to /dashboard with limited access
   ```

## Notes

- Accounts are pre-configured in the database
- Firebase authentication is still required for security
- Roles cannot be changed without database access
- Contact admin to modify roles or permissions

---
*Last updated: February 2026*
