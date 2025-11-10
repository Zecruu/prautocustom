# 🔄 Password Reset Flow Diagram

## Complete User Journey

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER FORGOT PASSWORD                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 1: Sign-In Page (/signin)                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Email: ___________________                               │  │
│  │  Password: _______________                                │  │
│  │                                                           │  │
│  │  [Forgot Password?] ← User clicks this                   │  │
│  │                                                           │  │
│  │  [Sign In]                                                │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 2: Forgot Password Page (/forgot-password)                │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Forgot Password?                                         │  │
│  │  Enter your email and we'll send you a reset link        │  │
│  │                                                           │  │
│  │  Email: john@example.com                                 │  │
│  │                                                           │  │
│  │  [Send Reset Link]                                        │  │
│  │                                                           │  │
│  │  ← Back to Sign In                                        │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 3: API Request (POST /api/auth/forgot-password)           │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  1. Find user by email                                    │  │
│  │  2. Generate random token (32 bytes)                      │  │
│  │  3. Hash token with SHA-256                               │  │
│  │  4. Save hashed token to database                         │  │
│  │  5. Set expiration (1 hour from now)                      │  │
│  │  6. Create reset URL with plain token                     │  │
│  │  7. Send email via Resend                                 │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 4: Success Message                                         │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  ✅ If an account with that email exists,                 │  │
│  │     a password reset link has been sent.                  │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 5: Email Sent (via Resend)                                │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  From: PR Auto Custom <noreply@prautocustoms.com>        │  │
│  │  To: john@example.com                                     │  │
│  │  Subject: Reset Your PR Auto Custom Password             │  │
│  │                                                           │  │
│  │  Hello John,                                              │  │
│  │                                                           │  │
│  │  We received a request to reset your password.           │  │
│  │                                                           │  │
│  │  [Reset Password] ← Button with reset link               │  │
│  │                                                           │  │
│  │  ⏰ This link will expire in 1 hour.                      │  │
│  │                                                           │  │
│  │  If you didn't request this, ignore this email.          │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 6: User Clicks Reset Link                                 │
│  URL: /reset-password?token=abc123xyz...                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 7: Token Verification (GET /api/auth/reset-password)      │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  1. Extract token from URL                                │  │
│  │  2. Hash token with SHA-256                               │  │
│  │  3. Find user with matching hashed token                  │  │
│  │  4. Check if token is expired                             │  │
│  │  5. Return valid/invalid status                           │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
                 VALID              INVALID
                    │                   │
                    ▼                   ▼
┌──────────────────────────┐  ┌──────────────────────────┐
│  STEP 8A: Valid Token    │  │  STEP 8B: Invalid Token  │
│  ┌────────────────────┐  │  │  ┌────────────────────┐  │
│  │  Reset Password    │  │  │  │  ❌ Invalid Link   │  │
│  │                    │  │  │  │                    │  │
│  │  For: john@...     │  │  │  │  This reset link   │  │
│  │                    │  │  │  │  is invalid or     │  │
│  │  New Password:     │  │  │  │  has expired.      │  │
│  │  _______________   │  │  │  │                    │  │
│  │                    │  │  │  │  [Request New Link]│  │
│  │  Confirm:          │  │  │  └────────────────────┘  │
│  │  _______________   │  │  └──────────────────────────┘
│  │                    │  │
│  │  [Reset Password]  │  │
│  └────────────────────┘  │
└──────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 9: Password Reset (POST /api/auth/reset-password)         │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  1. Validate passwords match                              │  │
│  │  2. Validate password length (min 6 chars)                │  │
│  │  3. Hash token and find user                              │  │
│  │  4. Check token not expired                               │  │
│  │  5. Update user password (bcrypt hashing)                 │  │
│  │  6. Clear reset token fields                              │  │
│  │  7. Save user to database                                 │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 10: Success & Redirect                                    │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  ✅ Password reset successful!                            │  │
│  │     You can now sign in with your new password.           │  │
│  │                                                           │  │
│  │  Redirecting to sign in...                                │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 11: Back to Sign-In Page                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Email: john@example.com                                  │  │
│  │  Password: ************** (new password)                  │  │
│  │                                                           │  │
│  │  [Sign In] ← User signs in with new password             │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────────┐
│  ✅ SUCCESS - User is signed in!                                │
└─────────────────────────────────────────────────────────────────┘
```

---

## Security Flow

```
┌─────────────────────────────────────────────────────────────────┐
│  TOKEN GENERATION & STORAGE                                      │
└─────────────────────────────────────────────────────────────────┘

Plain Token (sent in email):
abc123xyz789...
    │
    ▼
SHA-256 Hash:
5d41402abc4b2a76b9719d911017c592
    │
    ▼
Stored in Database:
{
  resetPasswordToken: "5d41402abc4b2a76b9719d911017c592",
  resetPasswordExpires: "2025-11-09T15:30:00Z"
}

┌─────────────────────────────────────────────────────────────────┐
│  TOKEN VERIFICATION                                              │
└─────────────────────────────────────────────────────────────────┘

User clicks link with plain token:
/reset-password?token=abc123xyz789...
    │
    ▼
Hash the token:
SHA-256(abc123xyz789...) = 5d41402abc4b2a76b9719d911017c592
    │
    ▼
Find user in database:
WHERE resetPasswordToken = "5d41402abc4b2a76b9719d911017c592"
  AND resetPasswordExpires > NOW()
    │
    ├─ Found? ✅ Valid token
    └─ Not found? ❌ Invalid or expired
```

---

## Error Handling Flow

```
┌─────────────────────────────────────────────────────────────────┐
│  POSSIBLE ERROR SCENARIOS                                        │
└─────────────────────────────────────────────────────────────────┘

1. Email doesn't exist
   ├─ Still show success message (security)
   └─ No email sent

2. User signed up with Google OAuth
   ├─ Still show success message (security)
   └─ No email sent

3. Token expired (> 1 hour)
   ├─ Show "Invalid or expired" error
   └─ User must request new reset link

4. Token already used
   ├─ Token cleared after successful reset
   └─ Show "Invalid or expired" error

5. Passwords don't match
   ├─ Show "Passwords do not match" error
   └─ User must re-enter passwords

6. Password too short (< 6 chars)
   ├─ Show "Password must be at least 6 characters" error
   └─ User must enter longer password

7. Email sending fails
   ├─ Clear reset token from database
   └─ Show "Failed to send email" error
```

---

## Database State Changes

```
┌─────────────────────────────────────────────────────────────────┐
│  USER DOCUMENT LIFECYCLE                                         │
└─────────────────────────────────────────────────────────────────┘

INITIAL STATE (Normal user):
{
  _id: "...",
  email: "john@example.com",
  password: "$2a$10$hashed_password",
  name: "John Doe",
  role: "client",
  resetPasswordToken: undefined,
  resetPasswordExpires: undefined
}
    │
    ▼ User requests password reset
    │
RESET REQUESTED:
{
  _id: "...",
  email: "john@example.com",
  password: "$2a$10$hashed_password",  ← Old password still valid
  name: "John Doe",
  role: "client",
  resetPasswordToken: "5d41402abc...",  ← Hashed token
  resetPasswordExpires: "2025-11-09T15:30:00Z"  ← 1 hour from now
}
    │
    ▼ User resets password
    │
RESET COMPLETE:
{
  _id: "...",
  email: "john@example.com",
  password: "$2a$10$new_hashed_password",  ← New password
  name: "John Doe",
  role: "client",
  resetPasswordToken: undefined,  ← Cleared
  resetPasswordExpires: undefined  ← Cleared
}
```

---

## Timeline

```
┌─────────────────────────────────────────────────────────────────┐
│  TYPICAL TIMELINE                                                │
└─────────────────────────────────────────────────────────────────┘

T+0s    User clicks "Forgot Password?"
T+5s    User enters email and submits
T+10s   Email sent via Resend
T+30s   User receives email
T+35s   User clicks reset link
T+40s   Token verified, reset form shown
T+50s   User enters new password
T+55s   Password reset successful
T+60s   User redirected to sign-in
T+65s   User signs in with new password
        ✅ SUCCESS

┌─────────────────────────────────────────────────────────────────┐
│  TOKEN EXPIRATION                                                │
└─────────────────────────────────────────────────────────────────┘

T+0m    Token generated
T+30m   Token still valid ✅
T+59m   Token still valid ✅
T+60m   Token still valid ✅
T+61m   Token expired ❌
```

---

## API Endpoints Summary

```
┌─────────────────────────────────────────────────────────────────┐
│  ENDPOINT REFERENCE                                              │
└─────────────────────────────────────────────────────────────────┘

POST /api/auth/forgot-password
├─ Input: { email: string }
├─ Output: { message: string }
└─ Action: Generate token, send email

GET /api/auth/reset-password?token=xxx
├─ Input: token (query param)
├─ Output: { valid: boolean, email?: string, name?: string }
└─ Action: Verify token validity

POST /api/auth/reset-password
├─ Input: { token: string, newPassword: string }
├─ Output: { message: string }
└─ Action: Reset password, clear token
```

---

## Files Involved

```
┌─────────────────────────────────────────────────────────────────┐
│  FILE STRUCTURE                                                  │
└─────────────────────────────────────────────────────────────────┘

Frontend (UI):
├─ src/app/signin/page.tsx (has "Forgot Password?" link)
├─ src/app/forgot-password/page.tsx (email input form)
└─ src/app/reset-password/page.tsx (new password form)

Backend (API):
├─ src/app/api/auth/forgot-password/route.ts (generate token)
└─ src/app/api/auth/reset-password/route.ts (verify & reset)

Database:
└─ src/models/User.ts (resetPasswordToken, resetPasswordExpires)

Email:
├─ emails/PasswordResetEmail.tsx (email template)
└─ src/lib/resend.ts (sendPasswordResetEmail function)

Documentation:
├─ FORGOT_PASSWORD_SETUP.md (this guide)
└─ PASSWORD_RESET_FLOW.md (flow diagrams)
```

---

## 🎯 Quick Reference

**User wants to reset password:**
1. Go to `/signin`
2. Click "Forgot Password?"
3. Enter email
4. Check email
5. Click reset link
6. Enter new password
7. Sign in

**Developer wants to test:**
1. Make sure Resend domain is verified
2. Start dev server: `npm run dev`
3. Go to `http://localhost:3000/signin`
4. Follow user flow above

**Developer wants to customize:**
- Email template: `emails/PasswordResetEmail.tsx`
- Token expiration: Change `60 * 60 * 1000` in `forgot-password/route.ts`
- Password requirements: Update validation in `reset-password/route.ts`
- UI styling: Edit page components in `src/app/`

