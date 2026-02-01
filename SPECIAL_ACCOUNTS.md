# Special Login Accounts

Pre-configured accounts with assigned roles.

## Admin Account
- **Email:** shashiii3110@helix.com
- **Role:** ADMIN
- **Access:** Full admin dashboard access

## User Account
- **Email:** shashiii3111@helix.com  
- **Role:** USER
- **Access:** Regular user dashboard

## How to Use

### First Time Setup
1. Go to http://localhost:3000/auth
2. Sign up using one of the emails above
3. Use any password (Firebase will validate)
4. The system will automatically assign the pre-configured role

### Subsequent Logins
- Use the same email and password
- Role is automatically applied from database

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
