# PR Auto Custom - Setup Guide

## Project Overview

This is a modern web application for PR Auto Custom featuring:
- Interactive rim/wheel visualizer with real-time preview
- Quote request system with EmailJS integration
- User authentication with Firebase (including Google OAuth)
- Bilingual support (English/Spanish)
- Dark theme with white gradient accents

## Technology Stack

- **Framework**: Next.js 15.5.6 with React 19
- **Styling**: Tailwind CSS 4
- **Authentication**: Firebase Auth
- **Email Service**: EmailJS
- **Internationalization**: i18next & react-i18next
- **Language**: TypeScript

## Prerequisites

- Node.js 18+ and npm
- Firebase project
- EmailJS account

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Zecruu/prautocustom.git
   cd prautocustom
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env.local`
   - Fill in your Firebase and EmailJS credentials

## Environment Variables Setup

### Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing one
3. Enable Authentication (Email/Password and Google)
4. Copy your Firebase config values to `.env.local`:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`

### EmailJS Setup

1. Go to [EmailJS](https://www.emailjs.com/)
2. Create an account and set up a service
3. Create an email template for quote requests
4. Copy your credentials to `.env.local`:
   - `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`
   - `NEXT_PUBLIC_EMAILJS_SERVICE_ID`
   - `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`
   - `NEXT_PUBLIC_COMPANY_EMAIL` (your company email)

## Running the Application

### Development Mode
```bash
npm run dev
```
The app will be available at `http://localhost:3000`

### Production Build
```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Home page
│   ├── signin/            # Sign in page
│   ├── signup/            # Sign up page
│   ├── profile/           # User profile page
│   ├── visualizer/        # Rim visualizer page
│   ├── quote/             # Quote request page
│   ├── layout.tsx         # Root layout with providers
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Navbar.tsx         # Navigation bar
│   ├── Hero.tsx           # Hero section
│   ├── ProductVisualizer.tsx  # Rim selector
│   └── I18nProvider.tsx   # i18n setup
├── context/               # React context
│   └── AuthContext.tsx    # Authentication context
└── lib/                   # Utilities
    ├── firebase.ts        # Firebase config
    ├── emailjs.ts         # EmailJS config
    ├── i18n.ts            # i18n configuration
    └── rimData.ts         # Rim data
```

## Features

### 1. Interactive Rim Visualizer
- Browse available rims/wheels
- Real-time preview on car image
- Detailed specifications (size, color, price)
- Direct quote request from visualizer

### 2. Quote System
- Pre-filled rim selection
- Customer information form
- Additional notes field
- EmailJS integration for quote delivery

### 3. User Authentication
- Email/password registration and login
- Google OAuth sign-in
- User profile management
- Quote history tracking (ready for implementation)

### 4. Internationalization
- English and Spanish support
- Language toggle in navbar
- All UI text translated

### 5. Design
- Dark theme with white gradient accents
- Responsive design (mobile, tablet, desktop)
- Company logo in navbar
- Hero image showcase

## Customization

### Adding More Rims
Edit `src/lib/rimData.ts` and add new rim objects to the `rims` array.

### Changing Colors/Theme
Edit `src/app/globals.css` to modify the color scheme.

### Updating Translations
Edit `src/lib/i18n.ts` to add or modify translations.

## Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms
The app can be deployed to any platform supporting Node.js:
- AWS
- Heroku
- DigitalOcean
- etc.

## Troubleshooting

### Build Errors
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`

### Firebase Issues
- Verify all environment variables are set correctly
- Check Firebase project settings
- Ensure authentication methods are enabled

### EmailJS Issues
- Verify service ID and template ID
- Check email template variables match form data
- Test with EmailJS dashboard

## Support

For issues or questions, please create an issue on GitHub.

## License

This project is proprietary to PR Auto Custom.

