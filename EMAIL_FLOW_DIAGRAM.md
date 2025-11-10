# 📊 Email Flow Diagrams

## Scenario 1: Client Submits Quote Request

```
┌─────────────────────────────────────────────────────────────────┐
│                    CLIENT SUBMITS QUOTE                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Your Website    │
                    │  Quote Form      │
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  API Route       │
                    │  /api/quotes     │
                    └──────────────────┘
                              │
                ┌─────────────┴─────────────┐
                │                           │
                ▼                           ▼
    ┌───────────────────────┐   ┌───────────────────────┐
    │ Email #1: To CLIENT   │   │ Email #2: To COMPANY  │
    │ (Confirmation)        │   │ (Notification)        │
    ├───────────────────────┤   ├───────────────────────┤
    │ FROM: noreply@        │   │ FROM: noreply@        │
    │       prautocustoms   │   │       prautocustoms   │
    │                       │   │                       │
    │ TO: client@gmail.com  │   │ TO: info@             │
    │                       │   │     prautocustoms.com │
    │ REPLY-TO: info@       │   │                       │
    │           prautocustoms│   │ REPLY-TO: client@    │
    │                       │   │           gmail.com   │
    │ SUBJECT:              │   │                       │
    │ "Quote Request        │   │ SUBJECT:              │
    │  Received #Q-12345"   │   │ "New Quote Request    │
    │                       │   │  #Q-12345 from John"  │
    └───────────────────────┘   └───────────────────────┘
                │                           │
                ▼                           ▼
    ┌───────────────────────┐   ┌───────────────────────┐
    │ Client receives       │   │ You receive email     │
    │ confirmation          │   │ in your inbox         │
    │                       │   │                       │
    │ If they reply →       │   │ If you reply →        │
    │ Goes to your company  │   │ Goes to CLIENT! ✅    │
    └───────────────────────┘   └───────────────────────┘
```

---

## Scenario 2: You Send Quote Response to Client

```
┌─────────────────────────────────────────────────────────────────┐
│              YOU RESPOND TO QUOTE REQUEST                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Admin Dashboard │
                    │  Quote Response  │
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  API Route       │
                    │  /api/admin/     │
                    │  quotes/respond  │
                    └──────────────────┘
                              │
                              ▼
                ┌───────────────────────────┐
                │ Email: Quote Response     │
                ├───────────────────────────┤
                │ FROM: noreply@            │
                │       prautocustoms.com   │
                │                           │
                │ TO: client@gmail.com      │
                │                           │
                │ REPLY-TO: sales@          │
                │           prautocustoms   │
                │           (or info@)      │
                │                           │
                │ SUBJECT:                  │
                │ "Quote Response from      │
                │  PR Auto Custom #Q-12345" │
                │                           │
                │ CONTENT:                  │
                │ • Products & Pricing      │
                │ • Subtotal, Tax, Total    │
                │ • Valid Until Date        │
                │ • Admin Notes             │
                └───────────────────────────┘
                              │
                              ▼
                ┌───────────────────────────┐
                │ Client receives quote     │
                │                           │
                │ If they reply →           │
                │ Goes to YOUR company! ✅  │
                └───────────────────────────┘
```

---

## Scenario 3: Welcome Email on Account Creation

```
┌─────────────────────────────────────────────────────────────────┐
│                  USER CREATES ACCOUNT                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Signup Form     │
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  API Route       │
                    │  /api/auth/      │
                    │  signup          │
                    └──────────────────┘
                              │
                              ▼
                ┌───────────────────────────┐
                │ Email: Welcome Email      │
                ├───────────────────────────┤
                │ FROM: noreply@            │
                │       prautocustoms.com   │
                │                           │
                │ TO: newuser@gmail.com     │
                │                           │
                │ REPLY-TO: info@           │
                │           prautocustoms   │
                │                           │
                │ SUBJECT:                  │
                │ "Welcome to PR Auto       │
                │  Custom!"                 │
                │                           │
                │ CONTENT:                  │
                │ • Welcome message         │
                │ • Account details         │
                │ • What's next             │
                │ • Contact info            │
                └───────────────────────────┘
                              │
                              ▼
                ┌───────────────────────────┐
                │ User receives welcome     │
                │                           │
                │ If they reply →           │
                │ Goes to YOUR company! ✅  │
                └───────────────────────────┘
```

---

## Key Concepts Visualized

### ❌ What DOESN'T Work (Email Spoofing)

```
┌─────────────────────────────────────────┐
│ Trying to send FROM client's email      │
├─────────────────────────────────────────┤
│ FROM: client@gmail.com  ❌              │
│ TO: info@prautocustoms.com              │
│                                         │
│ Result: REJECTED by Resend              │
│ Reason: You don't own gmail.com         │
└─────────────────────────────────────────┘
```

### ✅ What DOES Work (Reply-To Header)

```
┌─────────────────────────────────────────┐
│ Send FROM your domain, Reply-To client  │
├─────────────────────────────────────────┤
│ FROM: noreply@prautocustoms.com  ✅     │
│ TO: info@prautocustoms.com              │
│ REPLY-TO: client@gmail.com              │
│                                         │
│ Result: ✅ Email sent successfully      │
│ When you click Reply:                   │
│ → Automatically goes to client@gmail    │
└─────────────────────────────────────────┘
```

---

## Email Header Breakdown

### What the recipient sees:

```
┌────────────────────────────────────────────────────────┐
│ 📧 Email Client Display                                │
├────────────────────────────────────────────────────────┤
│                                                        │
│ From: PR Auto Custom <noreply@prautocustoms.com>      │
│ To: info@prautocustoms.com                            │
│ Subject: New Quote Request #Q-12345 from John Doe     │
│                                                        │
│ [Reply] [Reply All] [Forward]                         │
│                                                        │
│ ┌────────────────────────────────────────────────┐   │
│ │ When you click [Reply], your email client      │   │
│ │ automatically fills in:                        │   │
│ │                                                │   │
│ │ To: client@gmail.com  ← From Reply-To header! │   │
│ │ Subject: Re: New Quote Request #Q-12345...    │   │
│ └────────────────────────────────────────────────┘   │
│                                                        │
│ Email Body:                                            │
│ ┌────────────────────────────────────────────────┐   │
│ │ New Quote Request                              │   │
│ │ Quote Number: Q-12345                          │   │
│ │ Client Name: John Doe                          │   │
│ │ Client Email: client@gmail.com                 │   │
│ │ ...                                            │   │
│ └────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────┘
```

---

## Complete Quote Request Flow

```
CLIENT                    YOUR WEBSITE              YOUR COMPANY
  │                            │                          │
  │ 1. Fills quote form        │                          │
  ├───────────────────────────>│                          │
  │                            │                          │
  │                            │ 2. Saves to database     │
  │                            │                          │
  │                            │ 3. Sends confirmation    │
  │<───────────────────────────┤    to client             │
  │ ✉️ "Quote Received"        │                          │
  │ FROM: noreply@prautocustoms│                          │
  │ REPLY-TO: info@prautocustoms                          │
  │                            │                          │
  │                            │ 4. Sends notification    │
  │                            ├─────────────────────────>│
  │                            │    to company            │
  │                            │ ✉️ "New Quote Request"   │
  │                            │ FROM: noreply@prautocustoms
  │                            │ REPLY-TO: client@gmail   │
  │                            │                          │
  │                            │                          │
  │                            │ 5. You click Reply       │
  │<───────────────────────────┼──────────────────────────┤
  │ ✉️ Your reply goes         │                          │
  │    directly to client!     │                          │
  │                            │                          │
```

---

## Summary Table

| Email Type | From | To | Reply-To | Purpose |
|------------|------|-----|----------|---------|
| Quote Confirmation | Your domain | Client | Your company | Client knows quote received |
| Quote Notification | Your domain | Your company | **Client's email** | You can reply to client easily |
| Quote Response | Your domain | Client | Your company | Client can reply to you |
| Welcome Email | Your domain | New user | Your company | User can contact you |

**The Magic:** Reply-To header makes replies go where you want them! 🎯

