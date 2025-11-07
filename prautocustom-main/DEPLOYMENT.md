# PR Auto Custom - Deployment Guide

## 🚀 Deploy to Vercel

### Prerequisites
- GitHub account
- Vercel account (sign up at https://vercel.com)
- Environment variables ready

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Deploy to Vercel

#### Option A: Vercel Dashboard (Recommended)
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

4. Add Environment Variables:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
   NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_emailjs_service_id
   NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
   ```

5. Click **Deploy**

#### Option B: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### Step 3: Configure Custom Domain (Optional)
1. Go to your project settings in Vercel
2. Navigate to **Domains**
3. Add your custom domain
4. Update DNS records as instructed

## 🔧 Environment Variables

Make sure to set these in Vercel:

### Firebase Configuration
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

### EmailJS Configuration
- `NEXT_PUBLIC_EMAILJS_SERVICE_ID`
- `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`
- `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`

## 📱 Features Included

✅ WhatsApp floating button (+1 787-420-5538)
✅ Google Maps integration (Carolina, PR location)
✅ Multi-language support (EN/ES)
✅ Firebase authentication
✅ EmailJS quote system
✅ Responsive design
✅ SEO optimized

## 🌐 Post-Deployment

After deployment:
1. Test all features on the live site
2. Verify WhatsApp link works
3. Check Google Maps directions
4. Test language toggle
5. Test quote form submission
6. Verify Firebase authentication

## 🔗 Important Links

- **WhatsApp**: +1 787-420-5538
- **Location**: Carr 190 RR2 Box 327, Carolina, PR 00983
- **Made by**: [Nuvana](https://www.nuvanaweb.com/)

## 🐛 Troubleshooting

### Build Fails
- Check all environment variables are set
- Verify Node.js version (18.x or higher)
- Clear `.next` folder and rebuild

### Images Not Loading
- Ensure all images are in `public/` directory
- Check image paths are correct
- Verify image file names have no spaces

### Firebase Not Working
- Double-check all Firebase environment variables
- Verify Firebase project is active
- Check Firebase console for errors

## 📞 Support

For issues or questions, contact:
- **Nuvana Web**: https://www.nuvanaweb.com/
- **WhatsApp**: +1 787-420-5538

