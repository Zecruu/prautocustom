# 📧 How to Send Emails with Client's Email as Reply-To

## ❌ What You CANNOT Do

You **cannot** send emails directly from your client's email address (like `client@gmail.com`) using Resend. This is a security feature to prevent email spoofing.

**This will NOT work:**
```typescript
// ❌ WRONG - You can't send FROM client's email
await resend.emails.send({
  from: 'client@gmail.com', // ❌ This will fail!
  to: 'company@prautocustoms.com',
  subject: 'Quote Request',
});
```

---

## ✅ What You CAN Do: Use Reply-To Header

Send the email **from your verified domain**, but set the **reply-to** to your client's email. When you click "Reply", it will automatically go to your client!

### How It Works:

```
From: noreply@prautocustoms.com (your verified domain)
Reply-To: client@gmail.com (client's email)
To: info@prautocustoms.com (your company email)
```

When you receive this email and click "Reply", your email client will automatically address the reply to `client@gmail.com` instead of `noreply@prautocustoms.com`.

---

## 🎯 Use Cases

### Use Case 1: Client Submits Quote Request

**Goal:** Send quote request to your company email, but when you reply, it goes to the client.

**Solution:**
```typescript
import { sendQuoteRequestToCompany } from '@/lib/resend';

// When client submits a quote request
await sendQuoteRequestToCompany({
  clientEmail: 'john@gmail.com',      // Client's email
  clientName: 'John Doe',
  clientPhone: '+1 787 555 1234',
  quoteNumber: 'Q-12345',
  products: ['Custom Rims - 20"', 'Installation'],
  message: 'Looking for black rims',
  shippingAddress: '123 Main St, San Juan, PR',
});
```

**What happens:**
1. Email is sent **FROM** `noreply@prautocustoms.com`
2. Email is sent **TO** `info@prautocustoms.com` (your company)
3. **Reply-To** is set to `john@gmail.com` (client's email)
4. When you click "Reply" in your inbox, it automatically goes to `john@gmail.com`! ✅

---

### Use Case 2: Send Quote Response to Client

**Goal:** Send quote to client, but when they reply, it goes to your company email.

**Solution:**
```typescript
import { sendQuoteResponseEmail } from '@/lib/resend';

await sendQuoteResponseEmail({
  clientEmail: 'john@gmail.com',
  clientName: 'John Doe',
  quoteNumber: 'Q-12345',
  validUntil: '12/31/2025',
  products: [
    { name: 'Custom Rims - 20"', price: '1,200.00' },
  ],
  subtotal: '1,200.00',
  tax: '99.00',
  total: '1,299.00',
  replyTo: 'sales@prautocustoms.com', // Optional: Custom reply-to
});
```

**What happens:**
1. Email is sent **FROM** `noreply@prautocustoms.com`
2. Email is sent **TO** `john@gmail.com` (client)
3. **Reply-To** is set to `sales@prautocustoms.com` (or `info@prautocustoms.com` if not specified)
4. When client clicks "Reply", it goes to your company email! ✅

---

## 📝 Complete Integration Example

Here's how to integrate the quote request flow:

```typescript
// src/app/api/quotes/submit/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { sendQuoteConfirmationEmail, sendQuoteRequestToCompany } from '@/lib/resend';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Save quote to database
    const quote = await saveQuoteToDatabase(data);
    const quoteNumber = quote.id.slice(-8).toUpperCase();
    
    // 1. Send confirmation email to CLIENT
    try {
      await sendQuoteConfirmationEmail({
        clientEmail: data.email,
        clientName: data.name,
        quoteNumber: quoteNumber,
        submissionDate: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        products: data.selectedProducts.map((p: any) => p.name),
        message: data.message,
        shippingAddress: data.shippingAddress,
      });
      console.log('✅ Confirmation email sent to client');
    } catch (error) {
      console.error('❌ Failed to send confirmation to client:', error);
    }
    
    // 2. Send notification email to YOUR COMPANY (with client's email as reply-to)
    try {
      await sendQuoteRequestToCompany({
        clientEmail: data.email,        // Client's email (becomes reply-to)
        clientName: data.name,
        clientPhone: data.phone,
        quoteNumber: quoteNumber,
        products: data.selectedProducts.map((p: any) => p.name),
        message: data.message,
        shippingAddress: data.shippingAddress,
      });
      console.log('✅ Quote request sent to company');
    } catch (error) {
      console.error('❌ Failed to send quote to company:', error);
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

## 🔍 How It Looks in Your Inbox

### Email You Receive:

```
From: PR Auto Custom <noreply@prautocustoms.com>
Reply-To: john@gmail.com
To: info@prautocustoms.com
Subject: New Quote Request #Q-12345 from John Doe

New Quote Request
Quote Number: Q-12345
Client Name: John Doe
Client Email: john@gmail.com
Client Phone: +1 787 555 1234

Requested Products:
• Custom Rims - 20"
• Installation

Message:
Looking for black rims with chrome accents

Shipping Address:
123 Main St, San Juan, PR 00901

---
Click "Reply" to respond directly to John Doe
```

### When You Click "Reply":

Your email client automatically fills in:
```
To: john@gmail.com  ← Automatically filled!
Subject: Re: New Quote Request #Q-12345 from John Doe
```

---

## 🎨 Customizing Reply-To Addresses

You can customize the reply-to address for different scenarios:

### Example 1: Sales Team
```typescript
await sendQuoteResponseEmail({
  // ... other data
  replyTo: 'sales@prautocustoms.com',
});
```

### Example 2: Support Team
```typescript
await sendQuoteConfirmationEmail({
  // ... other data
  replyTo: 'support@prautocustoms.com',
});
```

### Example 3: Specific Employee
```typescript
await sendQuoteResponseEmail({
  // ... other data
  replyTo: 'maria@prautocustoms.com',
});
```

---

## 🚀 Available Functions

All these functions now support the `replyTo` parameter:

### 1. sendQuoteRequestToCompany (NEW!)
```typescript
// Sends quote request to YOUR company with client's email as reply-to
await sendQuoteRequestToCompany({
  clientEmail: string,      // Client's email (becomes reply-to)
  clientName: string,
  clientPhone: string,
  quoteNumber: string,
  products: string[],
  message?: string,
  shippingAddress?: string,
});
```

### 2. sendQuoteResponseEmail
```typescript
// Sends quote to client with optional custom reply-to
await sendQuoteResponseEmail({
  // ... all the quote data
  replyTo?: string,  // Optional: defaults to COMPANY_EMAIL
});
```

### 3. sendQuoteConfirmationEmail
```typescript
// Sends confirmation to client with optional custom reply-to
await sendQuoteConfirmationEmail({
  // ... all the confirmation data
  replyTo?: string,  // Optional: defaults to COMPANY_EMAIL
});
```

---

## 💡 Pro Tips

### Tip 1: Always Set Reply-To for Customer-Facing Emails
```typescript
// Good practice: Set reply-to to a monitored email
await sendQuoteResponseEmail({
  // ... data
  replyTo: 'sales@prautocustoms.com', // Monitored inbox
});
```

### Tip 2: Use Different Reply-To for Different Departments
```typescript
// Quote-related emails → sales team
replyTo: 'sales@prautocustoms.com'

// Support-related emails → support team
replyTo: 'support@prautocustoms.com'

// General inquiries → info
replyTo: 'info@prautocustoms.com'
```

### Tip 3: Test Reply-To Functionality
Send a test email to yourself and click "Reply" to verify it goes to the correct address.

---

## ⚠️ Important Notes

1. **From address MUST be your verified domain**
   - ✅ `noreply@prautocustoms.com`
   - ❌ `client@gmail.com`

2. **Reply-To can be ANY valid email address**
   - ✅ `client@gmail.com`
   - ✅ `sales@prautocustoms.com`
   - ✅ `anyone@anywhere.com`

3. **Most email clients respect Reply-To**
   - Gmail ✅
   - Outlook ✅
   - Apple Mail ✅
   - Yahoo Mail ✅

4. **Users can still see the From address**
   - They'll see it's from `noreply@prautocustoms.com`
   - But when they click Reply, it goes to the Reply-To address

---

## 🎯 Summary

| Scenario | From | To | Reply-To | Result |
|----------|------|-----|----------|--------|
| Client submits quote | Your domain | Your company | Client's email | You reply → goes to client ✅ |
| You send quote to client | Your domain | Client | Your company | Client replies → goes to you ✅ |
| Welcome email | Your domain | Client | Your company | Client replies → goes to you ✅ |

**The key:** Always send FROM your verified domain, use Reply-To to control where replies go! 🎉

