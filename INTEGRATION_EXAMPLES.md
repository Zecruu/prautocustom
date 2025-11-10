# 🔌 Email Integration Examples

This guide shows you exactly where and how to integrate the Resend email functions into your PR Auto Custom application.

---

## 1. Welcome Email (✅ Already Integrated)

**Location:** `src/app/api/auth/signup/route.ts`

**Status:** ✅ Complete - Already sending welcome emails when users sign up!

---

## 2. Quote Confirmation Email

**When to send:** When a user submits a quote request

**Where to integrate:** In your quote submission API route or form handler

### Example Integration:

```typescript
// src/app/api/quotes/submit/route.ts (or wherever you handle quote submissions)
import { NextRequest, NextResponse } from 'next/server';
import { sendQuoteConfirmationEmail } from '@/lib/resend';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Save quote to database
    const quote = await saveQuoteToDatabase(data);
    
    // Send confirmation email to customer
    try {
      await sendQuoteConfirmationEmail({
        clientEmail: data.email,
        clientName: data.name,
        quoteNumber: quote.id.slice(-8).toUpperCase(), // Last 8 chars of ID
        submissionDate: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        products: data.selectedProducts.map((p: any) => p.name),
        message: data.message,
        shippingAddress: data.shippingAddress,
      });
      console.log('✅ Quote confirmation email sent');
    } catch (emailError) {
      console.error('❌ Failed to send confirmation email:', emailError);
      // Don't fail the quote submission if email fails
    }
    
    return NextResponse.json({ 
      success: true, 
      quoteId: quote.id 
    });
  } catch (error) {
    console.error('Error submitting quote:', error);
    return NextResponse.json(
      { error: 'Failed to submit quote' },
      { status: 500 }
    );
  }
}
```

---

## 3. Quote Response Email

**When to send:** When admin/employee responds to a quote with pricing

**Where to integrate:** In your admin quote response API route

### Example Integration:

```typescript
// src/app/api/admin/quotes/respond/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { sendQuoteResponseEmail } from '@/lib/resend';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Update quote in database with pricing
    const quote = await updateQuoteWithPricing(data);
    
    // Calculate totals
    const subtotal = data.products.reduce((sum: number, p: any) => 
      sum + parseFloat(p.price), 0
    );
    const tax = subtotal * 0.115; // 11.5% tax for Puerto Rico
    const total = subtotal + tax;
    
    // Send quote response email to customer
    try {
      await sendQuoteResponseEmail({
        clientEmail: quote.customerEmail,
        clientName: quote.customerName,
        quoteNumber: quote.id.slice(-8).toUpperCase(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }), // 30 days from now
        products: data.products.map((p: any) => ({
          name: p.name,
          price: parseFloat(p.price).toFixed(2),
        })),
        subtotal: subtotal.toFixed(2),
        tax: tax.toFixed(2),
        total: total.toFixed(2),
        notes: data.adminNotes,
      });
      console.log('✅ Quote response email sent');
    } catch (emailError) {
      console.error('❌ Failed to send quote response email:', emailError);
      // Don't fail the quote response if email fails
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Quote sent to customer'
    });
  } catch (error) {
    console.error('Error sending quote response:', error);
    return NextResponse.json(
      { error: 'Failed to send quote response' },
      { status: 500 }
    );
  }
}
```

---

## 4. Password Change Email

**When to send:** When a user changes their password

**Where to integrate:** In your password change API route

### Example Integration:

```typescript
// src/app/api/auth/change-password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { sendPasswordChangeEmail } from '@/lib/resend';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    const { userId, newPassword } = await request.json();
    
    // Update password in database
    const user = await User.findById(userId);
    user.password = newPassword; // Will be hashed by pre-save hook
    await user.save();
    
    // Send password change notification
    try {
      await sendPasswordChangeEmail({
        userEmail: user.email,
        userName: user.name,
      });
      console.log('✅ Password change email sent');
    } catch (emailError) {
      console.error('❌ Failed to send password change email:', emailError);
      // Don't fail the password change if email fails
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Error changing password:', error);
    return NextResponse.json(
      { error: 'Failed to change password' },
      { status: 500 }
    );
  }
}
```

---

## 🎯 Quick Integration Checklist

For each email type, follow this pattern:

1. **Import the function:**
   ```typescript
   import { sendWelcomeEmail } from '@/lib/resend';
   ```

2. **Call it in a try-catch block:**
   ```typescript
   try {
     await sendWelcomeEmail({ ... });
     console.log('✅ Email sent');
   } catch (emailError) {
     console.error('❌ Email failed:', emailError);
     // Don't fail the main operation
   }
   ```

3. **Never fail the main operation if email fails:**
   - User signup should succeed even if welcome email fails
   - Quote submission should succeed even if confirmation email fails
   - Password change should succeed even if notification email fails

---

## 🔍 Finding Your API Routes

If you're not sure where your API routes are, search for:

- Quote submission: Look for files with "quote" in the name in `src/app/api/`
- Password change: Look for "password" or "auth" in `src/app/api/`
- Admin quote response: Look for "admin" in `src/app/api/`

Use VS Code search (Ctrl+Shift+F) to find:
- `"quote"` - Find quote-related code
- `"password"` - Find password-related code
- `"POST"` - Find API route handlers

---

## 💡 Pro Tips

### 1. Test in Development First
```typescript
// Add this to see email data without sending
if (process.env.NODE_ENV === 'development') {
  console.log('📧 Would send email:', {
    to: data.email,
    subject: 'Welcome!',
    // ... other data
  });
}
```

### 2. Add Email Logging
```typescript
// Log all emails for debugging
const emailResult = await sendWelcomeEmail(data);
console.log('Email sent with ID:', emailResult.id);
```

### 3. Handle Errors Gracefully
```typescript
try {
  await sendEmail(data);
} catch (error) {
  // Log to your error tracking service (Sentry, LogRocket, etc.)
  console.error('Email error:', error);
  // Optionally notify admin
}
```

---

## 🚨 Common Mistakes to Avoid

❌ **Don't do this:**
```typescript
// This will fail the entire operation if email fails
await sendWelcomeEmail(data);
return NextResponse.json({ success: true });
```

✅ **Do this instead:**
```typescript
// This continues even if email fails
try {
  await sendWelcomeEmail(data);
} catch (error) {
  console.error('Email failed:', error);
}
return NextResponse.json({ success: true });
```

---

## 📞 Need Help?

If you need help integrating these emails:

1. Check the Resend dashboard for error logs
2. Look at the console logs in your terminal
3. Verify your environment variables are set correctly
4. Make sure DNS records are verified

---

**Happy coding! 🚀**

