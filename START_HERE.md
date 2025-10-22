# 🎯 START HERE - Generate Your Rim Images

## 📍 **You Are Here**

Your visualizer is working with placeholder images. Let's generate real AI images!

---

## 🚀 **5-Minute Quick Start**

### **Step 1: Get Replicate Account** (2 min)

1. Open this link: **https://replicate.com**
2. Click "Sign up" → Sign up with Google
3. Go to: **https://replicate.com/account/api-tokens**
4. Click "Create token"
5. **COPY THE TOKEN** (looks like: `r8_abc123...`)

### **Step 2: Add $5 Credits** (2 min)

1. Go to: **https://replicate.com/account/billing**
2. Click "Add credits" → Add $5
3. (You'll only use $0.03, but $5 is minimum)

### **Step 3: Create .env.local File** (1 min)

**IN THIS FOLDER** (where you see this file), create a new file called `.env.local`

**Copy this into it:**
```
REPLICATE_API_TOKEN=paste_your_token_here
```

**Replace `paste_your_token_here` with your actual token from Step 1**

**Example:**
```
REPLICATE_API_TOKEN=r8_abc123def456ghi789
```

**SAVE THE FILE!**

### **Step 4: Generate Images** (5 min)

**Open terminal and run:**
```bash
npm run generate:images
```

**Wait 2-5 minutes...**

### **Step 5: Done!** ✅

Visit: **http://localhost:4329/visualizer**

Your visualizer now has professional AI-generated images!

---

## 📁 **Where to Create .env.local**

Create it **HERE** (same folder as this file):

```
prautocustom/
├── .env.local          ← CREATE THIS FILE HERE!
├── .env.local.example  ← Copy from this example
├── START_HERE.md       ← You are reading this
├── package.json
├── src/
└── public/
```

**NOT in:**
- ❌ `src/` folder
- ❌ `public/` folder
- ❌ `scripts/` folder

**YES in:**
- ✅ Root folder (same level as `package.json`)

---

## 🎨 **What You'll Get**

6 professional images of your car with different rims:
- Classic Chrome
- Sport Black
- Luxury Gold
- Racing Red
- Modern White
- Titanium Gray

---

## ❓ **Troubleshooting**

### "API key not found"
→ Make sure `.env.local` is in the ROOT folder  
→ Make sure you saved the file  
→ Close and reopen your terminal

### "Module not found"
→ Run: `npm install replicate`

### "Insufficient credits"
→ Add credits at: https://replicate.com/account/billing

---

## 📞 **Quick Links**

- **Get API Token:** https://replicate.com/account/api-tokens
- **Add Credits:** https://replicate.com/account/billing
- **Check Usage:** https://replicate.com/account/usage

---

## 💡 **Already Have an Account?**

Just need your API token:
1. Go to: https://replicate.com/account/api-tokens
2. Copy your existing token (or create a new one)
3. Put it in `.env.local`
4. Run: `npm run generate:images`

---

## 🎉 **That's It!**

**Total time:** ~5 minutes  
**Total cost:** ~$0.03  
**Result:** Professional AI-generated rim visualizations!

**Questions?** Check `GENERATE_IMAGES_NOW.md` for detailed instructions.

