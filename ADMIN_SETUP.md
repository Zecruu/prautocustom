# Admin Portal Setup Guide

## 🎯 Overview

This guide covers the setup for the PR Auto Custom admin/employee portal with:
- ✅ MongoDB database (replacing Firebase)
- ✅ Google OAuth authentication (direct, no Firebase)
- ✅ S3/Cloudflare R2 image storage
- ✅ Lazy-loaded optimized images
- ✅ Role-based access control (Admin, Employee, Client)

---

## 📦 What's Been Created

### 1. **MongoDB Schemas** (`src/models/`)
- **User.ts** - User accounts with roles (admin/employee/client)
- **Product.ts** - Product catalog with bilingual support (EN/ES)
- **Quote.ts** - Quote requests from clients
- **QuoteResponse.ts** - Employee responses to quotes

### 2. **Authentication** (`src/app/api/auth/`)
- NextAuth with Google OAuth
- Email/password authentication
- Role-based access control
- JWT session management

### 3. **Image Management** (`src/lib/s3.ts`)
- S3/Cloudflare R2 uploads
- Automatic image optimization with Sharp
- WebP conversion
- Thumbnail generation
- CDN integration

### 4. **Components**
- **LazyImage.tsx** - Optimized lazy-loading image component
- **Admin Sign-In Page** - Branded employee portal login

---

## 🔧 Environment Setup

### Step 1: MongoDB Setup

1. Create a MongoDB Atlas account: https://www.mongodb.com/cloud/atlas
2. Create a new cluster (free tier works)
3. Create a database user
4. Whitelist your IP (or use 0.0.0.0/0 for development)
5. Get your connection string

Add to `.env.local`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/prautocustom?retryWrites=true&w=majority
```

### Step 2: Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Application type: **Web application**
6. Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://www.prautocustoms.com/api/auth/callback/google` (production)

Add to `.env.local`:
```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Step 3: NextAuth Secret

Generate a secret:
```bash
openssl rand -base64 32
```

Add to `.env.local`:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_generated_secret_here
```

### Step 4: AWS S3 & CloudFront Setup

1. Go to [AWS Console](https://console.aws.amazon.com/)
2. **Create S3 bucket:**
   - Bucket name: `prautocustom-images`
   - Region: `us-east-1` (or your preferred region)
   - Uncheck "Block all public access" (we'll use CloudFront)
   - Enable versioning (optional)

3. **Create IAM user with S3 permissions:**
   - Go to IAM → Users → Create user
   - Attach policy: `AmazonS3FullAccess` (or create custom policy)
   - Generate access keys

4. **Set up CloudFront distribution:**
   - Go to CloudFront → Create distribution
   - Origin domain: Select your S3 bucket
   - Origin access: Origin access control settings (recommended)
   - Enable caching
   - Copy the CloudFront distribution URL

Add to `.env.local`:
```env
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=us-east-1
S3_BUCKET_NAME=prautocustom-images
CLOUDFRONT_URL=https://your-cloudfront-id.cloudfront.net
```

---

## 🚀 Running the Application

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

### Access Admin Portal
Navigate to: `http://localhost:3000/admin/signin`

---

## 👥 Creating Admin Users

### Method 1: Using the Create Admin Script (Recommended)

Run the interactive script to create your first admin user:

```bash
npm run create-admin
```

The script will prompt you for:
- Admin name
- Admin email
- Admin password (min 6 characters)
- Admin phone (optional)

### Method 2: Direct MongoDB Insert

Connect to your MongoDB and insert an admin user:

```javascript
db.users.insertOne({
  email: "admin@prautocustoms.com",
  password: "$2a$10$hashed_password_here", // Use bcrypt to hash
  name: "Admin User",
  role: "admin",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

---

## 📊 Database Schema Overview

### User Schema
```typescript
{
  email: string (unique, required)
  password: string (hashed, optional if using Google)
  name: string (required)
  role: 'admin' | 'employee' | 'client'
  googleId: string (optional)
  avatar: string (optional)
  phone: string (optional)
  lastLogin: Date
  isActive: boolean
}
```

### Product Schema
```typescript
{
  sku: string (unique, required)
  name: { en: string, es: string }
  category: string
  description: { en: string, es: string }
  images: string[] (S3/CDN URLs)
  specifications: Map<string, string>
  stock: number
  status: 'active' | 'hidden' | 'discontinued'
  createdBy: ObjectId (User)
  updatedBy: ObjectId (User)
}
```

### Quote Schema
```typescript
{
  client: ObjectId (User)
  products: [{ product: ObjectId, quantity: number, notes: string }]
  status: 'pending' | 'responded' | 'accepted' | 'rejected' | 'expired'
  message: string
  assignedTo: ObjectId (User - employee)
  respondedAt: Date
  expiresAt: Date
}
```

### QuoteResponse Schema
```typescript
{
  quote: ObjectId (Quote)
  client: ObjectId (User)
  respondedBy: ObjectId (User - employee)
  products: [{ product: ObjectId, quantity: number, unitPrice: number, totalPrice: number }]
  subtotal: number
  tax: number
  total: number
  message: string
  validUntil: Date
  status: 'sent' | 'viewed' | 'accepted' | 'rejected'
}
```

---

## 🔐 Role-Based Access

### Admin
- Full access to all features
- User management
- Product CRUD
- Quote management
- Reports and analytics

### Employee
- View and respond to quotes
- Product management
- Client management
- Limited reports

### Client
- Submit quote requests
- View their quotes
- View products
- Profile management

---

## 🖼️ Image Optimization

All images are automatically:
- ✅ Resized to max 1200x1200
- ✅ Converted to WebP format
- ✅ Compressed (85% quality)
- ✅ Lazy-loaded with intersection observer
- ✅ Cached with 1-year CDN cache headers

### Using LazyImage Component

```tsx
import { LazyImage } from '@/components/LazyImage';

<LazyImage
  src="https://cdn.prautocustoms.com/products/image.webp"
  alt="Product name"
  width={400}
  height={300}
  className="rounded-lg"
/>
```

---

## 📝 Next Steps

1. ✅ Set up environment variables
2. ✅ Create first admin user
3. ⏳ Build admin dashboard layout (next task)
4. ⏳ Implement dashboard pages
5. ⏳ Create product management UI
6. ⏳ Build quote management system

---

## 🆘 Troubleshooting

### MongoDB Connection Issues
- Check connection string format
- Verify IP whitelist
- Ensure database user has correct permissions

### Google OAuth Not Working
- Verify redirect URIs match exactly
- Check client ID and secret
- Ensure Google+ API is enabled

### Image Upload Fails
- Verify S3/R2 credentials
- Check bucket permissions
- Ensure bucket name is correct

---

## 📚 Resources

- [NextAuth.js Docs](https://next-auth.js.org/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Cloudflare R2](https://developers.cloudflare.com/r2/)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)

