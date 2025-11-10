# 📧 Resend Email Setup Guide for PR Auto Custom

## ✅ Migration Complete!

Your codebase has been successfully migrated from EmailJS to Resend with React Email templates.

---

## 🔧 What You Need to Do in Resend Dashboard

### Step 1: Add DNS Records to Your Domain Provider

Go to your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.) and add these DNS records:

#### Domain Verification Record:
```
Type: TXT
Name: resend._domainkey
Content: p=MIGfMA0GCSqGSIb3DQEB... (copy from Resend dashboard)
TTL: Auto
```

#### Enable Sending Records (3 records needed):

**1. MX Record:**
```
Type: MX
Name: send
Content: feedback-smtp.us-east-1.amazonses.com
Priority: 10
TTL: Auto
```

**2. SPF Record:**
```
Type: TXT
Name: send
Content: v=spf1 include:amazonses.com ~all
TTL: Auto
```

**3. DMARC Record (Optional but Recommended):**
```
Type: TXT
Name: _dmarc
Content: v=DMARC1; p=none;
TTL: Auto
```

### Step 2: Verify in Resend Dashboard

1. After adding all DNS records, go back to Resend dashboard
2. Click **"I've added the records"**
3. Wait for verification (usually 5-30 minutes, can take up to 72 hours)
4. You'll receive an email when verification is complete

### Step 3: Update Your Environment Variables

**IMPORTANT:** Update the `RESEND_FROM_EMAIL` in your `.env.local` file:

```env
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

Replace `yourdomain.com` with your actual verified domain.

**Suggested email addresses:**
- `noreply@yourdomain.com` - For automated emails
- `quotes@yourdomain.com` - For quote-related emails
- `support@yourdomain.com` - For support emails
- `hello@yourdomain.com` - For welcome emails

---

## 📨 Email Templates Created

### 1. Welcome Email
**Sent when:** User creates a new account
**Template:** `emails/WelcomeEmail.tsx`
**Function:** `sendWelcomeEmail()`

### 2. Quote Response Email
**Sent when:** Admin/employee responds to a quote request with pricing
**Template:** `emails/QuoteResponseEmail.tsx`
**Function:** `sendQuoteResponseEmail()`

### 3. Quote Confirmation Email
**Sent when:** User submits a quote request
**Template:** `emails/QuoteConfirmationEmail.tsx`
**Function:** `sendQuoteConfirmationEmail()`

### 4. Password Change Email
**Sent when:** User changes their password
**Template:** `emails/PasswordChangeEmail.tsx`
**Function:** `sendPasswordChangeEmail()`

---

## 🔌 How to Use the Email Functions

All email functions are in `src/lib/resend.ts`. Here's how to use them:

### Example 1: Send Welcome Email (Already Integrated)
```typescript
import { sendWelcomeEmail } from '@/lib/resend';

await sendWelcomeEmail({
  userEmail: 'customer@example.com',
  userName: 'John Doe',
});
```

### Example 2: Send Quote Response
```typescript
import { sendQuoteResponseEmail } from '@/lib/resend';

await sendQuoteResponseEmail({
  clientEmail: 'customer@example.com',
  clientName: 'John Doe',
  quoteNumber: 'Q-12345',
  validUntil: '12/31/2025',
  products: [
    { name: 'Custom Rims - 20"', price: '1,200.00' },
    { name: 'Installation', price: '150.00' },
  ],
  subtotal: '1,350.00',
  tax: '111.38',
  total: '1,461.38',
  notes: 'Free shipping included!',
});
```

### Example 3: Send Quote Confirmation
```typescript
import { sendQuoteConfirmationEmail } from '@/lib/resend';

await sendQuoteConfirmationEmail({
  clientEmail: 'customer@example.com',
  clientName: 'John Doe',
  quoteNumber: 'Q-12345',
  submissionDate: 'November 9, 2025',
  products: ['Custom Rims - 20"', 'Installation Service'],
  message: 'Looking for black rims with chrome accents',
  shippingAddress: '123 Main St, San Juan, PR 00901',
});
```

### Example 4: Send Password Change Email
```typescript
import { sendPasswordChangeEmail } from '@/lib/resend';

await sendPasswordChangeEmail({
  userEmail: 'customer@example.com',
  userName: 'John Doe',
});
```

---

## 🎨 Customizing Email Templates

All email templates are in the `emails/` folder. They use React Email components for beautiful, responsive emails.

To customize:
1. Open the template file (e.g., `emails/WelcomeEmail.tsx`)
2. Edit the JSX and styles
3. Save the file - changes take effect immediately

**Styling Tips:**
- Use inline styles (already set up)
- Colors match your brand: Dark theme (#1F2937) with yellow accents (#EAB308)
- All templates are mobile-responsive

---

## 🧪 Testing Emails Locally

### Option 1: Use Resend's Test Mode
Resend automatically uses test mode in development. Emails won't actually send but you'll see them in the Resend dashboard.

### Option 2: Preview Emails in Browser
Install React Email CLI:
```bash
npm install -g react-email
```

Then run:
```bash
email dev
```

This opens a browser preview of all your email templates at `http://localhost:3000`

---

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] DNS records added and verified in Resend
- [ ] `RESEND_FROM_EMAIL` updated with your verified domain
- [ ] `RESEND_API_KEY` added to production environment variables
- [ ] Test all 4 email types in production
- [ ] Monitor Resend dashboard for delivery status

---

## 📊 Environment Variables Reference

```env
# Resend Configuration
RESEND_API_KEY=re_44HTzSvZ_DekEjhpk3zo3yvbRkEQS9nq8
RESEND_FROM_EMAIL=noreply@yourdomain.com

# Company Information (used in emails)
NEXT_PUBLIC_COMPANY_EMAIL=info@prautocustoms.com
NEXT_PUBLIC_COMPANY_PHONE=+1 (787) 123-4567
NEXT_PUBLIC_WEBSITE_URL=https://prautocustoms.com
```

---

## 🆘 Troubleshooting

### Emails not sending?
1. Check DNS records are verified in Resend dashboard
2. Verify `RESEND_API_KEY` is correct
3. Check `RESEND_FROM_EMAIL` uses your verified domain
4. Look at Resend dashboard logs for errors

### DNS verification taking too long?
- DNS propagation can take up to 72 hours
- Use [DNS Checker](https://dnschecker.org) to verify records are live
- Make sure you added records to the correct domain

### Getting "Domain not verified" error?
- Wait for DNS verification to complete
- Double-check all DNS records match exactly
- Contact Resend support if stuck

---

## 📚 Additional Resources

- [Resend Documentation](https://resend.com/docs)
- [React Email Documentation](https://react.email/docs)
- [Resend Dashboard](https://resend.com/dashboard)

---

## ✨ What Changed in the Migration

### Removed:
- ❌ `@emailjs/browser` package
- ❌ `emailjs-com` package
- ❌ `src/lib/emailjs.ts`
- ❌ `src/lib/emailjs-server.ts`
- ❌ `EMAILJS_CONFIG.md`
- ❌ `EMAILJS_TEMPLATES_SETUP.md`

### Added:
- ✅ `resend` package
- ✅ `react-email` and all components
- ✅ `src/lib/resend.ts` - New email service
- ✅ `emails/WelcomeEmail.tsx`
- ✅ `emails/QuoteResponseEmail.tsx`
- ✅ `emails/QuoteConfirmationEmail.tsx`
- ✅ `emails/PasswordChangeEmail.tsx`

### Updated:
- ✅ `src/app/api/auth/signup/route.ts` - Now uses Resend
- ✅ `.env.local` - New Resend environment variables

---

**Need help?** Check the Resend dashboard logs or contact support at support@resend.com

