# 🚀 Forgot Password - Quick Start Guide

## ✅ What You Have Now

Your PR Auto Custom website now has a complete "Forgot Password" system! Here's what's ready:

### 📧 Email Template
- Beautiful password reset email with your branding
- Yellow accents (#EAB308) matching your site
- 1-hour expiration warning
- Security tips included

### 🔐 Security Features
- Tokens are hashed (SHA-256) before storage
- Tokens expire after 1 hour
- Single-use tokens (deleted after reset)
- Email enumeration prevention
- Password validation (min 6 characters)

### 🎨 User Interface
- `/forgot-password` - Email input page
- `/reset-password` - New password page
- Sign-in page already has "Forgot Password?" link
- Dark theme with yellow accents
- Fully responsive (mobile, tablet, desktop)
- Bilingual (English/Spanish)

---

## 🧪 Test It Right Now (3 Steps)

### Step 1: Start Your Dev Server
```bash
npm run dev
```

### Step 2: Go to Sign-In Page
Open your browser to:
```
http://localhost:3000/signin
```

### Step 3: Test the Flow
1. Click **"Forgot Password?"** link
2. Enter your email address
3. Click **"Send Reset Link"**
4. Check your email inbox
5. Click the reset link in the email
6. Enter your new password (twice)
7. Click **"Reset Password"**
8. Sign in with your new password ✅

---

## ⚠️ Before It Works in Production

### You MUST verify your domain in Resend:

1. **Go to Resend Dashboard:**
   ```
   https://resend.com/domains
   ```

2. **Add your domain:**
   ```
   prautocustoms.com
   ```

3. **Add these DNS records to your domain registrar:**

   **TXT Record (Domain Verification):**
   ```
   Name: resend._domainkey
   Value: [Copy from Resend dashboard]
   ```

   **MX Record (Enable Sending):**
   ```
   Name: send
   Value: feedback-smtp.us-east-1.amazonses.com
   Priority: 10
   ```

   **TXT Record (SPF):**
   ```
   Name: send
   Value: v=spf1 include:amazonses.com ~all
   ```

   **TXT Record (DMARC):**
   ```
   Name: _dmarc
   Value: v=DMARC1; p=none;
   ```

4. **Click "I've added the records" in Resend**

5. **Wait for verification** (5-30 minutes, up to 72 hours)

---

## 📋 Environment Variables

Make sure these are in your `.env.local`:

```env
# Resend (for sending emails)
RESEND_API_KEY=re_44HTzSvZ_DekEjhpk3zo3yvbRkEQS9nq8
RESEND_FROM_EMAIL=noreply@prautocustoms.com

# Company Info
NEXT_PUBLIC_COMPANY_EMAIL=info@prautocustoms.com
NEXT_PUBLIC_COMPANY_PHONE=+1 (787) 123-4567
NEXT_PUBLIC_WEBSITE_URL=https://prautocustoms.com

# NextAuth
NEXTAUTH_URL=http://localhost:3000  # Change to production URL when deploying
NEXTAUTH_SECRET=gslY+qZAGl7cZh9VDa+Zo82fAm2a+ik7C1uefPO3uJM=

# MongoDB
MONGODB_URI=mongodb+srv://nomnk5138:Redzone12@prautocustom.icfoprm.mongodb.net/?appName=Prautocustom
```

---

## 🎯 How It Works (Simple Version)

```
1. User clicks "Forgot Password?" on sign-in page
   ↓
2. User enters email
   ↓
3. System sends email with reset link
   ↓
4. User clicks link in email
   ↓
5. User enters new password
   ↓
6. Password is reset ✅
   ↓
7. User signs in with new password
```

---

## 📁 Files Created

### Email Template:
- `emails/PasswordResetEmail.tsx`

### API Routes:
- `src/app/api/auth/forgot-password/route.ts`
- `src/app/api/auth/reset-password/route.ts`

### UI Pages:
- `src/app/forgot-password/page.tsx`
- `src/app/reset-password/page.tsx`

### Database:
- `src/models/User.ts` (updated with reset token fields)

### Email Service:
- `src/lib/resend.ts` (added `sendPasswordResetEmail` function)

### Documentation:
- `FORGOT_PASSWORD_SETUP.md` (complete guide)
- `PASSWORD_RESET_FLOW.md` (flow diagrams)
- `FORGOT_PASSWORD_QUICKSTART.md` (this file)

---

## 🔍 Troubleshooting

### Problem: Email not received
**Solution:**
- Check Resend dashboard for delivery logs
- Verify domain is verified in Resend
- Check spam folder
- Make sure `RESEND_FROM_EMAIL` matches verified domain

### Problem: "Invalid or expired reset token"
**Solution:**
- Token expires after 1 hour - request new one
- Token is single-use - can't reuse after reset
- Make sure you're using the latest reset link

### Problem: "Passwords do not match"
**Solution:**
- Make sure both password fields are identical
- Check for extra spaces

### Problem: "Password must be at least 6 characters"
**Solution:**
- Enter a password with 6 or more characters

### Problem: OAuth users can't reset password
**Solution:**
- This is expected behavior
- Users who signed up with Google OAuth don't have passwords
- They must sign in with Google

---

## 🎨 Customization

### Change Token Expiration Time

Edit `src/app/api/auth/forgot-password/route.ts`:

```typescript
// Change from 1 hour to 2 hours:
user.resetPasswordExpires = new Date(Date.now() + 2 * 60 * 60 * 1000);
```

### Change Password Requirements

Edit `src/app/api/auth/reset-password/route.ts`:

```typescript
// Change from 6 to 8 characters:
if (newPassword.length < 8) {
  return NextResponse.json(
    { error: 'Password must be at least 8 characters' },
    { status: 400 }
  );
}
```

### Customize Email Template

Edit `emails/PasswordResetEmail.tsx`:
- Change colors
- Add your logo
- Modify text
- Add more security tips

### Change UI Colors

Edit the page components:
- `src/app/forgot-password/page.tsx`
- `src/app/reset-password/page.tsx`

Look for these classes:
- `bg-yellow-500` - Yellow buttons
- `text-yellow-500` - Yellow text
- `border-yellow-500` - Yellow borders

---

## 📊 What Happens in the Database

### Before Reset Request:
```json
{
  "email": "john@example.com",
  "password": "$2a$10$old_hashed_password",
  "resetPasswordToken": null,
  "resetPasswordExpires": null
}
```

### After Reset Request:
```json
{
  "email": "john@example.com",
  "password": "$2a$10$old_hashed_password",
  "resetPasswordToken": "5d41402abc4b2a76b9719d911017c592",
  "resetPasswordExpires": "2025-11-09T15:30:00Z"
}
```

### After Password Reset:
```json
{
  "email": "john@example.com",
  "password": "$2a$10$new_hashed_password",
  "resetPasswordToken": null,
  "resetPasswordExpires": null
}
```

---

## 🌐 Bilingual Support

The system automatically supports English and Spanish based on user's language preference:

| Page | English | Spanish |
|------|---------|---------|
| Sign-In Link | Forgot Password? | ¿Olvidaste tu contraseña? |
| Page Title | Forgot Password? | ¿Olvidaste tu contraseña? |
| Button | Send Reset Link | Enviar Enlace |
| Success | Reset link sent | Enlace enviado |

Translations are in `src/lib/i18n.ts`

---

## ✅ Production Checklist

Before deploying to production:

- [ ] Domain verified in Resend dashboard
- [ ] DNS records added and verified
- [ ] `RESEND_FROM_EMAIL` updated with your domain
- [ ] `NEXTAUTH_URL` updated with production URL
- [ ] Tested complete flow in development
- [ ] Tested with real email address
- [ ] Checked email arrives in inbox (not spam)
- [ ] Verified reset link works
- [ ] Confirmed password reset successful
- [ ] Tested sign-in with new password

---

## 🆘 Need More Help?

### Full Documentation:
- `FORGOT_PASSWORD_SETUP.md` - Complete setup guide
- `PASSWORD_RESET_FLOW.md` - Detailed flow diagrams
- `RESEND_SETUP_GUIDE.md` - Email setup instructions
- `QUICK_REFERENCE.md` - Email functions reference

### Check Logs:
- Resend Dashboard: https://resend.com/logs
- Browser Console: F12 → Console tab
- Server Logs: Check terminal where `npm run dev` is running

### Common Issues:
1. **Emails not sending** → Check Resend dashboard logs
2. **Token expired** → Request new reset link
3. **Invalid token** → Make sure using latest link
4. **OAuth users** → They must sign in with Google

---

## 🎉 You're All Set!

Your forgot password system is complete and ready to use!

**Next Steps:**
1. ✅ Test it in development
2. ✅ Verify your domain in Resend
3. ✅ Deploy to production
4. ✅ Update production environment variables

**Questions?**
Check the full documentation files or Resend dashboard for more details!

