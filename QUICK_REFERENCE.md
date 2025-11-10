# 🚀 Quick Reference: Resend Email Functions

## 📧 Available Email Functions

### 1. Welcome Email (Already Integrated ✅)
```typescript
import { sendWelcomeEmail } from '@/lib/resend';

await sendWelcomeEmail({
  userEmail: 'customer@example.com',
  userName: 'John Doe',
});
```

---

### 2. Quote Request to Company (NEW! ⭐)
**Use this when client submits a quote request**

```typescript
import { sendQuoteRequestToCompany } from '@/lib/resend';

await sendQuoteRequestToCompany({
  clientEmail: 'client@gmail.com',     // ← Becomes Reply-To!
  clientName: 'John Doe',
  clientPhone: '+1 787 555 1234',
  quoteNumber: 'Q-12345',
  products: ['Custom Rims - 20"', 'Installation'],
  message: 'Looking for black rims',
  shippingAddress: '123 Main St, San Juan, PR',
});
```

**Result:** Email sent to YOUR company. When you click Reply → goes to client! ✅

---

### 3. Quote Confirmation to Client
**Use this when client submits a quote request**

```typescript
import { sendQuoteConfirmationEmail } from '@/lib/resend';

await sendQuoteConfirmationEmail({
  clientEmail: 'client@gmail.com',
  clientName: 'John Doe',
  quoteNumber: 'Q-12345',
  submissionDate: 'November 9, 2025',
  products: ['Custom Rims - 20"', 'Installation'],
  message: 'Looking for black rims',
  shippingAddress: '123 Main St, San Juan, PR',
  replyTo: 'sales@prautocustoms.com', // Optional
});
```

**Result:** Confirmation sent to client. When they reply → goes to your company! ✅

---

### 4. Quote Response to Client
**Use this when you respond to a quote with pricing**

```typescript
import { sendQuoteResponseEmail } from '@/lib/resend';

await sendQuoteResponseEmail({
  clientEmail: 'client@gmail.com',
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
  replyTo: 'sales@prautocustoms.com', // Optional
});
```

**Result:** Quote sent to client. When they reply → goes to your company! ✅

---

### 5. Password Change Email
**Use this when user changes password**

```typescript
import { sendPasswordChangeEmail } from '@/lib/resend';

await sendPasswordChangeEmail({
  userEmail: 'customer@example.com',
  userName: 'John Doe',
});
```

**Result:** Security notification sent to user.

---

## 🎯 Common Patterns

### Pattern 1: Quote Submission Flow
```typescript
// When client submits quote request, send TWO emails:

// 1. Confirmation to client
await sendQuoteConfirmationEmail({ ... });

// 2. Notification to your company (with client's email as reply-to)
await sendQuoteRequestToCompany({ ... });
```

### Pattern 2: Quote Response Flow
```typescript
// When you respond to quote, send ONE email:

// Quote response to client
await sendQuoteResponseEmail({ ... });
```

### Pattern 3: Account Creation Flow
```typescript
// When user creates account, send ONE email:

// Welcome email to user
await sendWelcomeEmail({ ... });
```

---

## 🔑 Key Concepts

### From vs Reply-To

| Header | Value | Purpose |
|--------|-------|---------|
| **From** | `noreply@prautocustoms.com` | MUST be your verified domain |
| **Reply-To** | `client@gmail.com` or `sales@prautocustoms.com` | Where replies go |

### When to Use Reply-To

✅ **Use client's email as Reply-To when:**
- Sending quote notification to YOUR company
- You want to easily reply to the client

✅ **Use your company email as Reply-To when:**
- Sending emails to clients
- You want clients to reply to you

---

## 🚨 Error Handling Pattern

**Always wrap email calls in try-catch:**

```typescript
try {
  await sendWelcomeEmail({ ... });
  console.log('✅ Email sent');
} catch (error) {
  console.error('❌ Email failed:', error);
  // Don't fail the main operation!
}
```

**Why?** Email failures shouldn't break your app:
- User signup should succeed even if welcome email fails
- Quote submission should succeed even if notification fails

---

## 📋 Environment Variables

Make sure these are set in `.env.local`:

```env
# Resend
RESEND_API_KEY=re_44HTzSvZ_DekEjhpk3zo3yvbRkEQS9nq8
RESEND_FROM_EMAIL=noreply@prautocustoms.com

# Company Info (used in emails)
NEXT_PUBLIC_COMPANY_EMAIL=info@prautocustoms.com
NEXT_PUBLIC_COMPANY_PHONE=+1 (787) 123-4567
NEXT_PUBLIC_WEBSITE_URL=https://prautocustoms.com
```

---

## 🎨 Email Templates Location

All templates are in the `emails/` folder:
- `emails/WelcomeEmail.tsx`
- `emails/QuoteResponseEmail.tsx`
- `emails/QuoteConfirmationEmail.tsx`
- `emails/PasswordChangeEmail.tsx`

Edit these files to customize the email design!

---

## 🧪 Testing Checklist

Before going live:

- [ ] DNS records verified in Resend dashboard
- [ ] `RESEND_FROM_EMAIL` updated with your domain
- [ ] Test welcome email (create new account)
- [ ] Test quote confirmation (submit quote)
- [ ] Test quote notification to company (submit quote)
- [ ] Test quote response (send quote from admin)
- [ ] Verify Reply-To works (click Reply in email client)

---

## 📚 Full Documentation

- **RESEND_SETUP_GUIDE.md** - Complete setup instructions
- **REPLY_TO_GUIDE.md** - Detailed Reply-To explanation
- **EMAIL_FLOW_DIAGRAM.md** - Visual flow diagrams
- **INTEGRATION_EXAMPLES.md** - Code integration examples

---

## 💡 Pro Tips

1. **Test Reply-To:** Send yourself a test email and click Reply to verify it goes to the right address

2. **Monitor Resend Dashboard:** Check for delivery issues at https://resend.com/dashboard

3. **Use Different Reply-To for Different Teams:**
   - Quotes → `sales@prautocustoms.com`
   - Support → `support@prautocustoms.com`
   - General → `info@prautocustoms.com`

4. **Log Email IDs:** Save the returned email ID for tracking:
   ```typescript
   const result = await sendWelcomeEmail({ ... });
   console.log('Email ID:', result.id);
   ```

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| Emails not sending | Check DNS verification in Resend dashboard |
| "Domain not verified" error | Wait for DNS propagation (up to 72 hours) |
| Reply goes to wrong address | Check `replyTo` parameter in function call |
| Email in spam | Add SPF, DKIM, DMARC records (see setup guide) |

---

**Need help?** Check the full documentation files or Resend dashboard logs! 🚀

