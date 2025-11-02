# EmailJS Templates Setup Guide

This guide will help you create all the necessary email templates in your EmailJS dashboard.

## Prerequisites

1. Create an account at [EmailJS](https://www.emailjs.com/)
2. Set up an email service (Gmail, Outlook, etc.)
3. Get your Public Key, Service ID from the EmailJS dashboard
4. Add these to your `.env.local` file:
   ```
   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
   NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
   NEXT_PUBLIC_COMPANY_EMAIL=your-company@email.com
   ```

## Template 1: Quote Response to Client

**Template Name**: `quote_response_template`
**Template ID**: (Copy this to .env.local as `NEXT_PUBLIC_EMAILJS_QUOTE_RESPONSE_TEMPLATE_ID`)

### Subject Line:
```
Quote Response from PR Auto Custom - Quote #{{quote_number}}
```

### Email Body:
```html
<h2>Hello {{client_name}},</h2>

<p>Thank you for your quote request! We're pleased to provide you with the following quote:</p>

<h3>Quote #{{quote_number}}</h3>
<p><strong>Valid Until:</strong> {{valid_until}}</p>

<hr>

<h3>Products & Pricing:</h3>
{{product_details}}

<hr>

<h4>Summary:</h4>
<p><strong>Subtotal:</strong> ${{subtotal}}</p>
<p><strong>Tax:</strong> ${{tax}}</p>
<h3><strong>Total:</strong> ${{total}}</h3>

{{#notes}}
<hr>
<h4>Additional Notes:</h4>
<p>{{notes}}</p>
{{/notes}}

<hr>

<p>To view your complete quote details, please log in to your account at:</p>
<p><a href="{{website_url}}/profile" style="background-color: #EAB308; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">View Quote Details</a></p>

<p>If you have any questions, please don't hesitate to contact us.</p>

<p>Best regards,<br>
PR Auto Custom Team<br>
{{company_email}}<br>
{{company_phone}}</p>
```

### Template Variables:
- `to_email`: Client's email address
- `client_name`: Client's name
- `quote_number`: Quote ID (last 8 characters)
- `valid_until`: Expiration date
- `product_details`: HTML formatted list of products
- `subtotal`: Subtotal amount
- `tax`: Tax amount
- `total`: Total amount
- `notes`: Optional admin notes
- `website_url`: Your website URL
- `company_email`: Your company email
- `company_phone`: Your company phone

---

## Template 2: Account Activation / Welcome Email

**Template Name**: `account_welcome_template`
**Template ID**: (Copy this to .env.local as `NEXT_PUBLIC_EMAILJS_WELCOME_TEMPLATE_ID`)

### Subject Line:
```
Welcome to PR Auto Custom!
```

### Email Body:
```html
<h2>Welcome to PR Auto Custom, {{user_name}}!</h2>

<p>Thank you for creating an account with us. We're excited to have you as part of our community!</p>

<div style="background-color: #1F2937; padding: 20px; border-radius: 8px; margin: 20px 0;">
  <h3 style="color: #EAB308; margin-top: 0;">Your Account Details:</h3>
  <p style="color: #fff;"><strong>Email:</strong> {{user_email}}</p>
  <p style="color: #fff;"><strong>Account Status:</strong> Active ✓</p>
</div>

<h3>What's Next?</h3>
<ul>
  <li>Browse our premium automotive customization products</li>
  <li>Request quotes for custom work</li>
  <li>Track your quote requests and responses</li>
  <li>Manage your profile and preferences</li>
</ul>

<p style="margin: 30px 0;">
  <a href="{{website_url}}/products" style="background-color: #EAB308; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; margin-right: 10px;">Browse Products</a>
  <a href="{{website_url}}/profile" style="background-color: #374151; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">My Profile</a>
</p>

<hr style="margin: 30px 0;">

<p>If you have any questions or need assistance, our team is here to help!</p>

<p>Best regards,<br>
PR Auto Custom Team<br>
{{company_email}}<br>
{{company_phone}}</p>

<p style="font-size: 12px; color: #9CA3AF; margin-top: 20px;">If you didn't create this account, please contact us immediately.</p>
```

### Template Variables:
- `to_email`: User's email address
- `user_name`: User's name
- `user_email`: User's email (displayed in email)
- `website_url`: Your website URL
- `company_email`: Your company email
- `company_phone`: Your company phone

---

## Template 3: Password Change Confirmation

**Template Name**: `password_change_template`
**Template ID**: (Copy this to .env.local as `NEXT_PUBLIC_EMAILJS_PASSWORD_CHANGE_TEMPLATE_ID`)

### Subject Line:
```
Password Changed Successfully - PR Auto Custom
```

### Email Body:
```html
<h2>Hello {{user_name}},</h2>

<p>This email confirms that your password was successfully changed.</p>

<div style="background-color: #1F2937; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #EAB308;">
  <h3 style="color: #EAB308; margin-top: 0;">Security Alert</h3>
  <p style="color: #fff;"><strong>When:</strong> {{change_date}}</p>
  <p style="color: #fff;"><strong>Account:</strong> {{user_email}}</p>
</div>

<h3>What This Means:</h3>
<ul>
  <li>Your password has been updated successfully</li>
  <li>You can now log in with your new password</li>
  <li>All other devices will remain logged in</li>
</ul>

<div style="background-color: #FEF3C7; padding: 15px; border-radius: 8px; border-left: 4px solid #F59E0B; margin: 20px 0;">
  <p style="margin: 0; color: #92400E;"><strong>⚠️ Didn't make this change?</strong></p>
  <p style="margin: 10px 0 0 0; color: #92400E;">If you didn't change your password, please contact us immediately and secure your account.</p>
</div>

<p style="margin: 30px 0;">
  <a href="{{website_url}}/profile" style="background-color: #EAB308; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">Go to My Profile</a>
</p>

<hr style="margin: 30px 0;">

<p>For security reasons, we recommend:</p>
<ul>
  <li>Use a strong, unique password</li>
  <li>Don't share your password with anyone</li>
  <li>Enable two-factor authentication if available</li>
</ul>

<p>Best regards,<br>
PR Auto Custom Team<br>
{{company_email}}<br>
{{company_phone}}</p>
```

### Template Variables:
- `to_email`: User's email address
- `user_name`: User's name
- `user_email`: User's email (displayed in email)
- `change_date`: Date/time of password change
- `website_url`: Your website URL
- `company_email`: Your company email
- `company_phone`: Your company phone

---

## Template 4: Quote Request Confirmation

**Template Name**: `quote_confirmation_template`
**Template ID**: (Copy this to .env.local as `NEXT_PUBLIC_EMAILJS_QUOTE_CONFIRMATION_TEMPLATE_ID`)

### Subject Line:
```
Quote Request Received - Quote #{{quote_number}}
```

### Email Body:
```html
<h2>Hello {{client_name}},</h2>

<p>Thank you for your quote request! We've received your submission and our team will review it shortly.</p>

<div style="background-color: #1F2937; padding: 20px; border-radius: 8px; margin: 20px 0;">
  <h3 style="color: #EAB308; margin-top: 0;">Quote Request Summary</h3>
  <p style="color: #fff;"><strong>Quote Number:</strong> #{{quote_number}}</p>
  <p style="color: #fff;"><strong>Submitted:</strong> {{submission_date}}</p>
  <p style="color: #fff;"><strong>Status:</strong> Pending Review</p>
</div>

<h3>Requested Products:</h3>
{{product_list}}

{{#message}}
<h4>Your Message:</h4>
<div style="background-color: #F3F4F6; padding: 15px; border-radius: 8px; margin: 15px 0;">
  <p style="margin: 0; color: #1F2937;">{{message}}</p>
</div>
{{/message}}

{{#shipping_address}}
<h4>Shipping Address:</h4>
<p style="margin: 5px 0; color: #4B5563;">{{shipping_address}}</p>
{{/shipping_address}}

<hr style="margin: 30px 0;">

<h3>What Happens Next?</h3>
<ol>
  <li>Our team will review your quote request</li>
  <li>We'll prepare a detailed quote with pricing</li>
  <li>You'll receive an email notification when your quote is ready</li>
  <li>You can also check your quote status anytime in your profile</li>
</ol>

<p style="margin: 30px 0;">
  <a href="{{website_url}}/profile" style="background-color: #EAB308; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">View My Quotes</a>
</p>

<div style="background-color: #DBEAFE; padding: 15px; border-radius: 8px; border-left: 4px solid #3B82F6; margin: 20px 0;">
  <p style="margin: 0; color: #1E40AF;"><strong>💡 Typical Response Time:</strong> 1-2 business days</p>
</div>

<hr style="margin: 30px 0;">

<p>If you have any questions in the meantime, feel free to reach out to us!</p>

<p>Best regards,<br>
PR Auto Custom Team<br>
{{company_email}}<br>
{{company_phone}}</p>
```

### Template Variables:
- `to_email`: Client's email address
- `client_name`: Client's name
- `quote_number`: Quote ID (last 8 characters)
- `submission_date`: Date submitted
- `product_list`: HTML formatted list of requested products
- `message`: Optional client message
- `shipping_address`: Optional shipping address
- `website_url`: Your website URL
- `company_email`: Your company email
- `company_phone`: Your company phone

---

## Setup Steps in EmailJS Dashboard

1. **Log in to EmailJS** at https://dashboard.emailjs.com/

2. **Create Service** (if not already done):
   - Go to "Email Services"
   - Click "Add New Service"
   - Choose your email provider (Gmail, Outlook, etc.)
   - Follow the authentication steps
   - Note the Service ID

3. **Create Each Template**:
   - Go to "Email Templates"
   - Click "Create New Template"
   - Copy the template name and content from above
   - Add all the template variables
   - Save and note the Template ID

4. **Update .env.local**:
   ```env
   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
   NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
   NEXT_PUBLIC_EMAILJS_QUOTE_RESPONSE_TEMPLATE_ID=template_xxxxx
   NEXT_PUBLIC_EMAILJS_WELCOME_TEMPLATE_ID=template_xxxxx
   NEXT_PUBLIC_EMAILJS_PASSWORD_CHANGE_TEMPLATE_ID=template_xxxxx
   NEXT_PUBLIC_EMAILJS_QUOTE_CONFIRMATION_TEMPLATE_ID=template_xxxxx
   NEXT_PUBLIC_COMPANY_EMAIL=your-email@company.com
   NEXT_PUBLIC_COMPANY_PHONE=+1 (555) 123-4567
   NEXT_PUBLIC_WEBSITE_URL=https://yourwebsite.com
   ```

5. **Test Templates**:
   - Use the EmailJS dashboard test feature
   - Send test emails with sample data
   - Verify formatting and links work correctly

## Notes

- All templates use HTML formatting for better visual presentation
- Templates include company branding colors (black/yellow theme)
- Responsive design works on mobile and desktop email clients
- Optional fields use conditional blocks ({{#field}}...{{/field}})
- Security alerts included for sensitive operations

## Support

For EmailJS specific questions, visit:
- EmailJS Documentation: https://www.emailjs.com/docs/
- EmailJS Support: https://www.emailjs.com/support/

