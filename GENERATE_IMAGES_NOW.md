# 🚀 Generate Your Rim Images NOW - Simple Guide

Follow these 5 easy steps to generate professional AI images for your visualizer!

---

## ✅ **Step 1: Sign Up for Replicate** (2 minutes)

1. Go to: **https://replicate.com**
2. Click **"Sign up"** (top right)
3. Sign up with Google or Email
4. Verify your email

---

## ✅ **Step 2: Get Your API Token** (1 minute)

1. Go to: **https://replicate.com/account/api-tokens**
2. Click **"Create token"**
3. **Copy the token** (it looks like: `r8_abc123...`)
4. Keep this window open!

---

## ✅ **Step 3: Add Credits** (2 minutes)

1. Go to: **https://replicate.com/account/billing**
2. Click **"Add credits"**
3. Add **$5** (you'll only use ~$0.03, but $5 is the minimum)
4. Enter payment info and confirm

---

## ✅ **Step 4: Add Your API Token to the Project** (1 minute)

1. **Open your project folder** in VS Code (you're already here!)

2. **Create a new file** called `.env.local` in the ROOT of your project
   - Right-click in the file explorer
   - Click "New File"
   - Name it: `.env.local`

3. **Paste this into the file:**
   ```
   REPLICATE_API_TOKEN=paste_your_token_here
   ```

4. **Replace `paste_your_token_here`** with the token you copied in Step 2

5. **Save the file** (Ctrl+S or Cmd+S)

**Example:**
```
REPLICATE_API_TOKEN=r8_abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
```

---

## ✅ **Step 5: Run the Generation Script** (5 minutes)

1. **Open a new terminal** in VS Code:
   - Press `` Ctrl+` `` (backtick key)
   - Or go to: Terminal → New Terminal

2. **Run this command:**
   ```bash
   npm run generate:images
   ```

3. **Wait 2-5 minutes** while it generates 6 images

4. **Done!** Your images are now in `public/generated/`

---

## 🎉 **That's It!**

Your visualizer will now show professional AI-generated car images with different rims!

**Test it:** http://localhost:4329/visualizer

---

## 🔧 **Troubleshooting**

### ❌ "API key not found"
- Make sure `.env.local` is in the ROOT folder (same level as `package.json`)
- Make sure you saved the file
- Restart your terminal and try again

### ❌ "Module not found: replicate"
- Run: `npm install replicate`
- Then try again

### ❌ "Insufficient credits"
- Go to https://replicate.com/account/billing
- Add more credits

### ❌ Images look weird
- That's okay! You can regenerate them
- Try adjusting the prompts in `scripts/generate-rim-images.js`
- Or just run the script again for different variations

---

## 💰 **Cost Breakdown**

- **Total cost:** ~$0.03 for 6 images
- **Your $5 credit** will last for ~166 images
- You can generate many variations!

---

## 🎨 **Want Different Results?**

### Change the Car Type

Edit `scripts/generate-rim-images.js` line 38:

```javascript
const baseCarDescription = "sleek gray sports car";
```

Change to:
- `"red Ferrari sports car"`
- `"black Mercedes luxury sedan"`
- `"white BMW M3"`
- `"blue Porsche 911"`

Then run `npm run generate:images` again!

---

## 📞 **Need Help?**

1. Check that `.env.local` exists and has your token
2. Make sure you have credits on Replicate
3. Try running `npm install replicate` again
4. Restart your terminal

---

## 🔗 **Quick Links**

- **Replicate Dashboard:** https://replicate.com/account
- **API Tokens:** https://replicate.com/account/api-tokens
- **Billing:** https://replicate.com/account/billing
- **Usage:** https://replicate.com/account/usage

---

## ⏭️ **Next Steps After Generation**

1. ✅ Images are generated in `public/generated/`
2. ✅ Visualizer automatically uses them
3. ✅ Test at: http://localhost:4329/visualizer
4. ✅ Share with your client!

**No code changes needed - it just works!** 🎉

