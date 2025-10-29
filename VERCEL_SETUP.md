# 🚀 Vercel Deployment - Add Google Analytics

## Quick Setup (2 minutes)

Your Google Analytics is already configured locally! Now let's add it to Vercel so it works in production.

### Your Google Analytics ID
```
G-0WQGS2FLKQ
```

---

## Step-by-Step Instructions

### 1. Go to Vercel Dashboard
- Visit: https://vercel.com/dashboard
- Sign in with your account
- Select your **prautocustom** project

### 2. Add Environment Variable

1. Click **Settings** (top navigation)
2. Click **Environment Variables** (left sidebar)
3. Add a new variable:

   **Key:**
   ```
   NEXT_PUBLIC_GA_MEASUREMENT_ID
   ```

   **Value:**
   ```
   G-0WQGS2FLKQ
   ```

   **Environments:** Select all three:
   - ✅ Production
   - ✅ Preview
   - ✅ Development

4. Click **Save**

### 3. Redeploy Your Site

**Option A: Automatic (Recommended)**
- Just push any commit to GitHub
- Vercel will automatically redeploy with the new variable

**Option B: Manual**
1. Go to **Deployments** tab
2. Click the **⋯** menu on the latest deployment
3. Click **Redeploy**
4. Confirm

---

## ✅ Verify It's Working

### Test in Production (After Redeployment)

1. **Visit your live site**: https://www.prautocustoms.com
2. **Open Browser DevTools**: Press `F12`
3. **Go to Console tab**
4. **Look for**: Google Analytics messages (no errors)
5. **Check Network tab**: Look for requests to `googletagmanager.com`

### Check Google Analytics Dashboard

1. Go to: https://analytics.google.com/
2. Click **Real-time** (left sidebar)
3. Open your website in another tab
4. You should see **1 active user** (you!)

---

## 🎯 What Happens Now

Once deployed, your site will automatically track:

- ✅ **Page Views** - Every page visit
- ✅ **User Sessions** - How long people stay
- ✅ **Traffic Sources** - Where visitors come from
- ✅ **Popular Pages** - Most visited pages
- ✅ **Device Types** - Mobile vs Desktop
- ✅ **Geographic Data** - Where users are located
- ✅ **User Behavior** - Navigation patterns

---

## 📊 View Your Analytics

### Real-Time Data
- **URL**: https://analytics.google.com/
- **Section**: Real-time
- **Shows**: Current visitors on your site

### Historical Data (Available after 24-48 hours)
- **Reports** → **Engagement** → **Pages and screens**
- **Reports** → **Acquisition** → **Traffic acquisition**
- **Reports** → **User** → **Demographics**

---

## 🔧 Troubleshooting

### Analytics Not Showing Data

**Check 1: Environment Variable**
```bash
# In Vercel dashboard, verify:
NEXT_PUBLIC_GA_MEASUREMENT_ID = G-0WQGS2FLKQ
```

**Check 2: Redeployment**
- Make sure you redeployed after adding the variable
- Environment variables only take effect after redeployment

**Check 3: Browser Console**
- Open DevTools → Console
- Look for any Google Analytics errors
- Should see gtag.js loading successfully

**Check 4: Ad Blockers**
- Disable ad blockers when testing
- They often block Google Analytics

### Still Not Working?

1. **Clear browser cache** and reload
2. **Wait 24-48 hours** for data to appear in reports
3. **Check Real-time view** instead of historical reports
4. **Test in incognito mode** to avoid extensions

---

## 🎉 You're All Set!

Your Google Analytics is now:
- ✅ Configured locally (`.env.local`)
- ✅ Ready for Vercel deployment
- ✅ Tracking all page views
- ✅ Providing valuable insights

### Next Steps After Deployment

1. **Monitor traffic** in Google Analytics dashboard
2. **Set up goals** for quote requests
3. **Track conversions** (form submissions)
4. **Analyze user behavior** to improve UX
5. **Review weekly reports** to understand trends

---

## 📞 Need Help?

- **Vercel Docs**: https://vercel.com/docs/concepts/projects/environment-variables
- **Google Analytics Help**: https://support.google.com/analytics
- **Test Your Setup**: Use Real-time view in GA dashboard

---

**Pro Tip**: After deploying, visit your site and check the Real-time view in Google Analytics. You should see yourself as an active user within seconds! 🎯

