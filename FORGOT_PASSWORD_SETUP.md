# 🔐 Forgot Password System - Complete Setup Guide

## ✅ What's Been Created

Your PR Auto Custom website now has a complete "Forgot Password" system for clients! Here's what was built:

### 1. Email Template ✅
**File:** `emails/PasswordResetEmail.tsx`
- Beautiful dark-themed email matching your brand
- Yellow accent colors (#EAB308)
- Reset button with expiration warning
- Security tips included
- Bilingual support (EN/ES)

### 2. Database Updates ✅
**File:** `src/models/User.ts`
- Added `resetPasswordToken` field (hashed for security)
- Added `resetPasswordExpires` field (1 hour expiration)
- Both fields are hidden from queries by default

### 3. API Routes ✅

#### Forgot Password Request
**File:** `src/app/api/auth/forgot-password/route.ts`
- Accepts email address
- Generates secure reset token
- Sends password reset email
- Prevents email enumeration attacks (always returns success)

#### Reset Password Verification
**File:** `src/app/api/auth/reset-password/route.ts`
- **POST:** Resets password with valid token
- **GET:** Verifies token validity
- Automatic token cleanup after use
- 1-hour token expiration

### 4. User Interface ✅

#### Forgot Password Page
**File:** `src/app/forgot-password/page.tsx`
**URL:** `/forgot-password`
- Email input form
- Success/error messages
- Link back to sign-in
- Dark theme with yellow accents

#### Reset Password Page
**File:** `src/app/reset-password/page.tsx`
**URL:** `/reset-password?token=xxx`
- Token verification on load
- New password + confirm password fields
- Password strength validation (min 6 chars)
- Auto-redirect to sign-in after success
- Invalid token error handling

### 5. Sign-In Integration ✅
**File:** `src/app/signin/page.tsx`
- "Forgot Password?" link already exists (line 100-103)
- Bilingual support via i18n
- Links to `/forgot-password`

### 6. Email Service ✅
**File:** `src/lib/resend.ts`
- New function: `sendPasswordResetEmail()`
- Uses Resend API
- React Email template rendering

---

## 🎯 How It Works

### User Flow:

```
1. User clicks "Forgot Password?" on sign-in page
   ↓
2. User enters email on /forgot-password
   ↓
3. System generates secure token and sends email
   ↓
4. User clicks reset link in email
   ↓
5. User lands on /reset-password?token=xxx
   ↓
6. System verifies token is valid and not expired
   ↓
7. User enters new password (twice)
   ↓
8. Password is reset and user redirected to sign-in
   ↓
9. User signs in with new password ✅
```

---

## 🔒 Security Features

### 1. Token Hashing
- Reset tokens are hashed with SHA-256 before storing in database
- Only hashed version is stored (never plain text)
- Tokens are cryptographically random (32 bytes)

### 2. Token Expiration
- Tokens expire after 1 hour
- Expired tokens are automatically rejected
- Tokens are deleted after successful password reset

### 3. Email Enumeration Prevention
- Always returns success message, even if email doesn't exist
- Prevents attackers from discovering valid email addresses
- Consistent response times

### 4. Password Validation
- Minimum 6 characters required
- Password confirmation required
- Passwords are hashed with bcrypt before storage

### 5. OAuth User Protection
- Users who signed up with Google OAuth cannot reset password
- System silently ignores reset requests for OAuth-only accounts

---

## 📧 Email Example

When a user requests a password reset, they receive:

**Subject:** Reset Your PR Auto Custom Password

**Content:**
- Personalized greeting with user's name
- Clear "Reset Password" button
- Expiration warning (1 hour)
- Security tips
- Company contact information
- Bilingual support (EN/ES)

**From:** `noreply@prautocustoms.com`
**To:** User's email address

---

## 🧪 Testing Checklist

Before going live, test these scenarios:

### ✅ Happy Path
- [ ] User enters valid email
- [ ] Email is received within 1 minute
- [ ] Reset link works
- [ ] New password is accepted
- [ ] User can sign in with new password

### ✅ Error Cases
- [ ] Invalid email format is rejected
- [ ] Non-existent email returns generic success (security)
- [ ] Expired token shows error
- [ ] Invalid token shows error
- [ ] Passwords that don't match are rejected
- [ ] Password < 6 characters is rejected

### ✅ OAuth Users
- [ ] Google OAuth users get generic success (no email sent)
- [ ] OAuth users can still sign in with Google

### ✅ Security
- [ ] Token is only valid once
- [ ] Token expires after 1 hour
- [ ] Old tokens don't work after password reset
- [ ] Can't enumerate valid emails

---

## 🚀 How to Test Right Now

### 1. Start your development server:
```bash
npm run dev
```

### 2. Navigate to sign-in page:
```
http://localhost:3000/signin
```

### 3. Click "Forgot Password?" link

### 4. Enter your email address

### 5. Check your email for reset link
**Note:** Make sure your Resend domain is verified first!

### 6. Click the reset link in email

### 7. Enter new password (twice)

### 8. Sign in with new password

---

## 🔧 Configuration

### Environment Variables Required:

```env
# Resend (for sending emails)
RESEND_API_KEY=re_44HTzSvZ_DekEjhpk3zo3yvbRkEQS9nq8
RESEND_FROM_EMAIL=noreply@prautocustoms.com

# Company Info (used in emails)
NEXT_PUBLIC_COMPANY_EMAIL=info@prautocustoms.com
NEXT_PUBLIC_COMPANY_PHONE=+1 (787) 123-4567
NEXT_PUBLIC_WEBSITE_URL=https://prautocustoms.com

# NextAuth (for generating reset URLs)
NEXTAUTH_URL=http://localhost:3000  # Change to production URL when deploying
```

---

## 📱 Responsive Design

All pages are fully responsive:
- ✅ Mobile (320px+)
- ✅ Tablet (768px+)
- ✅ Desktop (1024px+)

---

## 🌐 Bilingual Support

The system supports English and Spanish:

| English | Spanish |
|---------|---------|
| Forgot Password? | ¿Olvidaste tu contraseña? |
| Reset Password | Restablecer Contraseña |
| Email Address | Correo Electrónico |
| New Password | Nueva Contraseña |
| Confirm Password | Confirmar Contraseña |

Translations are in `src/lib/i18n.ts`

---

## 🎨 Design

All pages match your brand:
- **Background:** Dark gradient (gray-900 to black)
- **Accent Color:** Yellow (#EAB308)
- **Cards:** Semi-transparent gray with blur effect
- **Buttons:** Yellow gradient with hover effects
- **Text:** White headings, gray body text

---

## 🔗 Related Files

### Email Templates:
- `emails/PasswordResetEmail.tsx` - Reset email template
- `emails/WelcomeEmail.tsx` - Welcome email (already integrated)
- `emails/PasswordChangeEmail.tsx` - Password change notification

### API Routes:
- `src/app/api/auth/forgot-password/route.ts` - Request reset
- `src/app/api/auth/reset-password/route.ts` - Verify & reset
- `src/app/api/auth/signup/route.ts` - User signup (sends welcome email)

### UI Pages:
- `src/app/forgot-password/page.tsx` - Forgot password form
- `src/app/reset-password/page.tsx` - Reset password form
- `src/app/signin/page.tsx` - Sign-in page (has forgot link)

### Database:
- `src/models/User.ts` - User model with reset token fields

### Email Service:
- `src/lib/resend.ts` - All email sending functions

---

## 🚨 Important Notes

### 1. DNS Verification Required
Before emails will send, you must verify your domain in Resend:
- See `RESEND_SETUP_GUIDE.md` for DNS records
- Add TXT, MX, SPF, and DMARC records
- Wait for verification (5-30 minutes, up to 72 hours)

### 2. Production URL
Update `NEXTAUTH_URL` in `.env.local` when deploying:
```env
NEXTAUTH_URL=https://prautocustoms.com
```

### 3. Token Security
- Never log reset tokens in production
- Tokens are single-use only
- Tokens expire after 1 hour
- Tokens are hashed in database

---

## 📊 Database Schema

The User model now includes:

```typescript
interface IUser {
  // ... existing fields ...
  resetPasswordToken?: string;      // Hashed token (SHA-256)
  resetPasswordExpires?: Date;      // Expiration timestamp
}
```

These fields are:
- Optional (only set when reset is requested)
- Hidden from queries by default (`select: false`)
- Automatically cleared after successful reset

---

## ✅ All Done!

Your forgot password system is complete and ready to use! 🎉

**Next Steps:**
1. ✅ Verify your domain in Resend dashboard
2. ✅ Test the complete flow
3. ✅ Deploy to production
4. ✅ Update `NEXTAUTH_URL` for production

**Need Help?**
- Check `RESEND_SETUP_GUIDE.md` for email setup
- Check `QUICK_REFERENCE.md` for email functions
- Check Resend dashboard for email logs

