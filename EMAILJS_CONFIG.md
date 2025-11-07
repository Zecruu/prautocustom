# EmailJS Configuration

## Your EmailJS Credentials

### Service Configuration:
- **Service ID**: `service_if0a549`
- **Public Key**: `1Z8c2sX3tn4hvcMaB`
- **Private Key**: `0i0jqWbwV4j1xlc2DcJZd` (Keep this secret!)

### Template IDs:
- **Template 1** (Quote Response): `template_8hgrgrg`
- **Template 2** (Welcome Email): `template_fmv1zvn`

---

## Environment Variables Setup

### For Local Development (.env.local):

Add these to your `.env.local` file:

```env
# EmailJS Configuration
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_if0a549
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=1Z8c2sX3tn4hvcMaB
NEXT_PUBLIC_EMAILJS_QUOTE_RESPONSE_TEMPLATE_ID=template_8hgrgrg
NEXT_PUBLIC_EMAILJS_WELCOME_TEMPLATE_ID=template_fmv1zvn

# Company Information
NEXT_PUBLIC_COMPANY_EMAIL=admin@prautocustoms.com
NEXT_PUBLIC_COMPANY_PHONE=+1 (787) 667-1643
NEXT_PUBLIC_WEBSITE_URL=https://prautocustoms.com
```

---

## ✅ Vercel Dashboard Environment Variables

**YES, you need to add these to Vercel!** Since they start with `NEXT_PUBLIC_`, they are exposed to the client side.

### Steps to add in Vercel:

1. Go to your Vercel dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add each of these variables:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `NEXT_PUBLIC_EMAILJS_SERVICE_ID` | `service_if0a549` | Production, Preview, Development |
| `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` | `1Z8c2sX3tn4hvcMaB` | Production, Preview, Development |
| `NEXT_PUBLIC_EMAILJS_QUOTE_RESPONSE_TEMPLATE_ID` | `template_8hgrgrg` | Production, Preview, Development |
| `NEXT_PUBLIC_EMAILJS_WELCOME_TEMPLATE_ID` | `template_fmv1zvn` | Production, Preview, Development |
| `NEXT_PUBLIC_COMPANY_EMAIL` | `admin@prautocustoms.com` | Production, Preview, Development |
| `NEXT_PUBLIC_COMPANY_PHONE` | `+1 (787) 667-1643` | Production, Preview, Development |
| `NEXT_PUBLIC_WEBSITE_URL` | `https://prautocustoms.com` | Production, Preview, Development |

5. Click **Save**
6. **Redeploy** your application for changes to take effect

---

## Current Implementation Status

### ✅ Template 1: Quote Response to Client
**Template ID**: `template_8hgrgrg`

**When it sends**: When admin responds to a quote request with pricing

**Where to integrate**: In the admin quote response API route

**Function to use**:
```typescript
import { sendQuoteResponseEmail } from '@/lib/emailjs';

await sendQuoteResponseEmail({
  clientEmail: 'client@example.com',
  clientName: 'John Doe',
  quoteNumber: 'D11A7D58',
  validUntil: '11/14/2025',
  productDetails: '<ul><li>Product 1 - $100.00</li></ul>',
  subtotal: '100.00',
  tax: '8.25',
  total: '108.25',
  notes: 'Optional admin notes'
});
```

---

### ✅ Template 2: Welcome Email
**Template ID**: `template_fmv1zvn`

**When it sends**: When user creates a new account

**Where to integrate**: In the signup API route

**Function to use**:
```typescript
import { sendWelcomeEmail } from '@/lib/emailjs';

await sendWelcomeEmail({
  userEmail: 'newuser@example.com',
  userName: 'John Doe'
});
```

---

## Integration Points

### 1. Quote Response Email
**File**: `src/app/api/admin/quotes/respond/route.ts`

Add after creating the quote response:

```typescript
try {
  // Create quote response (existing code)
  const quoteResponse = await QuoteResponse.create({ ... });

  // Format product details for email
  const productDetails = products.map(p => 
    `<li>${p.product.name.en} (x${p.quantity}) - $${p.totalPrice.toFixed(2)}</li>`
  ).join('');

  // Send email notification
  await sendQuoteResponseEmail({
    clientEmail: user.email,
    clientName: user.name,
    quoteNumber: String(quote._id).slice(-8).toUpperCase(),
    validUntil: new Date(quoteResponse.validUntil).toLocaleDateString(),
    productDetails: `<ul>${productDetails}</ul>`,
    subtotal: subtotal.toFixed(2),
    tax: tax.toFixed(2),
    total: total.toFixed(2),
    notes: notes || ''
  });
} catch (error) {
  console.error('Error sending email:', error);
  // Continue even if email fails
}
```

---

### 2. Welcome Email
**File**: `src/app/api/auth/signup/route.ts`

Add after creating the user:

```typescript
try {
  // Create user (existing code)
  const user = await User.create({ ... });

  // Send welcome email
  await sendWelcomeEmail({
    userEmail: user.email,
    userName: user.name
  });

  return NextResponse.json({ message: 'Account created successfully' });
} catch (error) {
  console.error('Error sending welcome email:', error);
  // Continue even if email fails
  return NextResponse.json({ message: 'Account created successfully' });
}
```

---

## Testing Checklist

### Local Testing:
1. ✅ Add env variables to `.env.local`
2. ✅ Restart dev server (`npm run dev`)
3. ✅ Test signup → check for welcome email
4. ✅ Test quote response → check for quote email
5. ✅ Check browser console for errors
6. ✅ Verify emails arrive with correct formatting

### Production Testing:
1. ✅ Add all env variables to Vercel dashboard
2. ✅ Redeploy application
3. ✅ Test signup in production
4. ✅ Test quote response in production
5. ✅ Monitor Vercel logs for any errors

---

## Important Notes

### Security:
- ⚠️ **Private Key**: Keep `0i0jqWbwV4j1xlc2DcJZd` secret (not used in client-side code)
- ✅ **Public Key**: Safe to expose (already in client-side env vars)
- ✅ All template IDs and service IDs are safe to expose

### Email Limits:
- EmailJS free tier: 200 emails/month
- Consider upgrading if you expect more traffic

### Troubleshooting:
- If emails don't send, check EmailJS dashboard for errors
- Verify template IDs match exactly
- Check browser console for initialization errors
- Ensure EmailJS service is active in dashboard

---

## Quick Start Commands

```bash
# 1. Add env variables to .env.local (copy the variables above)

# 2. Restart your dev server
npm run dev

# 3. Test locally first before deploying

# 4. When ready, add to Vercel and redeploy
```

---

## Support

If you encounter issues:
1. Check EmailJS dashboard for delivery status
2. Verify all env variables are set correctly
3. Check browser console for JavaScript errors
4. Review Vercel deployment logs
5. Test email sending from EmailJS dashboard directly

