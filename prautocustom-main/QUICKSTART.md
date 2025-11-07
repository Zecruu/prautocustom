# Quick Start Guide - PR Auto Custom

## 1. Clone & Install

```bash
git clone https://github.com/Zecruu/prautocustom.git
cd prautocustom
npm install
```

## 2. Configure Environment

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

Edit `.env.local` with:
- Firebase credentials (from Firebase Console)
- EmailJS credentials (from EmailJS dashboard)

## 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 4. Test the Features

### Home Page
- View hero section with company branding
- See language toggle (EN/ES) in navbar
- Click "Start Customizing" to go to visualizer

### Visualizer Page
- Browse available rims
- Click on a rim to see details
- Click "Request Quote" to proceed

### Quote Page
- Fill in your information
- Select rim from dropdown
- Add any additional notes
- Submit to send quote via email

### Authentication
- Click "Sign Up" to create account
- Use email/password or Google OAuth
- Access profile page after login

## 5. Build for Production

```bash
npm run build
npm start
```

## 6. Deploy

### To Vercel (Recommended)
1. Push to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables
5. Deploy

### To Other Platforms
The app is a standard Next.js app and can be deployed to:
- AWS
- Heroku
- DigitalOcean
- Netlify
- etc.

## Key Files to Customize

- **Rims**: `src/lib/rimData.ts` - Add/edit rim options
- **Translations**: `src/lib/i18n.ts` - Add/edit text in EN/ES
- **Styling**: `src/app/globals.css` - Modify colors and theme
- **Company Info**: `.env.local` - Update company email

## Troubleshooting

**Port 3000 already in use?**
```bash
npm run dev -- -p 3001
```

**Build fails?**
```bash
rm -rf .next node_modules
npm install
npm run build
```

**Firebase not working?**
- Check `.env.local` has all Firebase variables
- Verify Firebase project has Auth enabled
- Check Google OAuth is configured

**Emails not sending?**
- Verify EmailJS credentials in `.env.local`
- Check EmailJS template ID matches
- Test template in EmailJS dashboard

## Next Steps

1. Set up Firebase project
2. Set up EmailJS account
3. Configure environment variables
4. Run development server
5. Test all features
6. Deploy to production

For detailed setup instructions, see [SETUP.md](./SETUP.md)

