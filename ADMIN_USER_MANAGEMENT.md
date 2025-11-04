# Admin User Management System

## Overview
Complete admin authentication and user management system with username-based login and role-based access control.

## Key Features

### 1. Username-Based Admin Login ✅
- **Admin/Employee Login**: Uses username instead of email
- **Removed Google Sign-In**: Admin login now only supports credentials-based authentication
- **No Placeholder Text**: Clean, minimal username field
- **Role Verification**: Only admin and employee roles can access admin portal

### 2. User Model Updates ✅
- Added `username` field (optional, sparse index)
- Username required for admin/employee accounts
- Username automatically converted to lowercase
- Unique constraint on username field
- Clients don't require usernames

### 3. Authentication Updates ✅
**Updated NextAuth Configuration** (`src/app/api/auth/[...nextauth]/route.ts`):
- Supports both email login (for clients) and username login (for admin/employee)
- `isAdminLogin` flag differentiates between client and admin authentication
- Role-based access verification
- Prevents client accounts from accessing admin portal

### 4. Admin User Management Page ✅
**Location**: `/admin/users`

**Features**:
- View all users with details (name, email, username, role, status)
- Create new users with roles (admin, employee, client)
- Edit existing users (name, username, password, role, status)
- Delete users (with confirmation)
- Role-based color coding
- Active/Inactive status toggle

**Access**: Admin-only (restricted to users with role='admin')

### 5. API Endpoints ✅

#### `POST /api/admin/users`
Create new user (Admin only)
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "username": "johndoe",  // Required for admin/employee
  "password": "securepass",
  "role": "employee",     // admin | employee | client
  "isActive": true
}
```

#### `GET /api/admin/users`
List all users (Admin only)
- Returns all users with sensitive data removed
- Sorted by creation date (newest first)

#### `PATCH /api/admin/users/[id]`
Update user (Admin only)
```json
{
  "name": "John Updated",
  "username": "johnupdated",
  "password": "newpassword",  // Optional
  "role": "admin",
  "isActive": true
}
```

#### `DELETE /api/admin/users/[id]`
Delete user (Admin only)
- Prevents admin from deleting themselves
- Requires confirmation

## Security Features

✅ **Role-Based Access Control**
- Admin-only endpoints verified via session
- Username login restricted to admin/employee roles
- Client accounts cannot access admin portal

✅ **Password Security**
- Minimum 6 characters
- Automatic hashing via bcrypt (pre-save hook)
- Password never returned in responses

✅ **Username Validation**
- Unique constraint enforced
- Lowercase normalization
- Required for admin/employee accounts

✅ **Account Status**
- Active/Inactive toggle
- Inactive accounts cannot log in

## User Flow

### Creating Admin/Employee Users
1. Admin logs in with username and password
2. Navigate to "Users" in sidebar
3. Click "+ Create User"
4. Fill in:
   - Name *
   - Email *
   - Username * (for admin/employee)
   - Password *
   - Role (admin/employee/client)
   - Active status
5. User is created and can immediately log in

### Admin Login Flow
1. Visit `/admin/signin`
2. Enter **username** (not email)
3. Enter password
4. System verifies:
   - User exists with this username
   - User role is admin or employee
   - Password is correct
   - Account is active
5. Redirect to dashboard

### Updating User Information
1. Admin navigates to Users page
2. Click "Edit" on any user
3. Can update:
   - Name
   - Username
   - Password (optional, only if changing)
   - Role
   - Active status
4. Email is read-only (cannot be changed)

## Technical Implementation

### Database Schema Changes
```typescript
interface IUser {
  email: string;
  password?: string;
  name: string;
  username?: string;        // NEW - for admin/employee login
  role: 'admin' | 'employee' | 'client';
  googleId?: string;
  avatar?: string;
  phone?: string;
  lastLogin?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Files Modified/Created

**Modified**:
- `src/models/User.ts` - Added username field
- `src/app/admin/signin/page.tsx` - Changed to username login, removed Google
- `src/app/api/auth/[...nextauth]/route.ts` - Updated authentication logic
- `src/components/admin/Sidebar.tsx` - Already had Users menu item

**Created**:
- `src/app/api/admin/users/route.ts` - GET (list) and POST (create) users
- `src/app/api/admin/users/[id]/route.ts` - PATCH (update) and DELETE users
- `src/app/admin/users/page.tsx` - User management UI

## Migration Notes

### For Existing Admin Users
- Existing admin users need a `username` field added to their accounts
- Use the User Management page to add usernames to existing admin/employee accounts
- Or update directly in MongoDB:
```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { username: "adminuser" } }
);
```

### First Admin Account
If you don't have any admin users yet, you'll need to create one directly in MongoDB:
```javascript
// Using bcrypt to hash password
const bcrypt = require('bcryptjs');
const hashedPassword = await bcrypt.hash('your_password', 10);

db.users.insertOne({
  email: "admin@prautocustoms.com",
  name: "Admin User",
  username: "admin",
  password: hashedPassword,
  role: "admin",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
});
```

## Environment Variables
No new environment variables required.

## Testing Checklist

- [ ] Admin can log in with username
- [ ] Employee can log in with username
- [ ] Client cannot access admin login
- [ ] Admin can create new users
- [ ] Username validation works (unique, required for admin/employee)
- [ ] Admin can update user passwords
- [ ] Admin can update usernames
- [ ] Admin can change user roles
- [ ] Admin can activate/deactivate users
- [ ] Admin can delete users (except themselves)
- [ ] Inactive users cannot log in
- [ ] Google sign-in removed from admin page
- [ ] Username field has no placeholder text
- [ ] Client login still works with email

## Future Enhancements

- Email verification for new users
- Password reset functionality for admin-managed accounts
- Audit log for user changes
- Bulk user import/export
- Custom role creation beyond admin/employee/client

