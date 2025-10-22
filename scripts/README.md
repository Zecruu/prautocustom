# 🎨 Image Generation Scripts

This directory contains scripts for generating AI-powered car visualizations with different rims.

## 📋 Quick Start

### 1. Install Dependencies

Choose one method and install its dependencies:

**For Replicate (Recommended):**
```bash
npm install replicate
```

**For OpenAI DALL-E 3:**
```bash
npm install openai
```

**For Fal.ai:**
```bash
npm install @fal-ai/serverless-client
```

### 2. Set Up API Keys

Create a `.env.local` file in the root directory:

```env
# Choose one:
REPLICATE_API_TOKEN=your_replicate_token_here
# OR
OPENAI_API_KEY=your_openai_key_here
# OR
FAL_KEY=your_fal_key_here
```

### 3. Edit the Script

Open `generate-rim-images.js` and uncomment your preferred method:

```javascript
// Choose one:
await generateWithReplicate();  // Recommended
// await generateWithDallE();
// await generateWithFal();
```

### 4. Run the Script

```bash
npm run generate:images
```

## 🎯 Output

The script will generate 6 images in `public/generated/`:
- `car-classic-chrome.png`
- `car-sport-black.png`
- `car-luxury-gold.png`
- `car-racing-red.png`
- `car-modern-white.png`
- `car-titanium-gray.png`

## 🔧 Customization

### Change the Base Car

Edit the `baseCarDescription` variable in `generate-rim-images.js`:

```javascript
const baseCarDescription = "sleek gray sports car"; // Change this
```

### Adjust Image Quality

Each method has quality settings you can tweak:

**Replicate:**
```javascript
num_inference_steps: 50,  // Higher = better quality (slower)
guidance_scale: 7.5,       // Higher = more prompt adherence
```

**DALL-E 3:**
```javascript
quality: "hd",  // or "standard"
size: "1024x1024",
```

**Fal.ai:**
```javascript
num_inference_steps: 28,
guidance_scale: 3.5,
```

## 💰 Cost Estimates

| Method | Cost per Image | Total (6 images) |
|--------|---------------|------------------|
| Replicate | ~$0.005 | ~$0.03 |
| DALL-E 3 | $0.04 | $0.24 |
| Fal.ai | ~$0.003 | ~$0.02 |

## 🆘 Troubleshooting

**Error: "API key not found"**
- Make sure you've created `.env.local` with your API key
- Restart your terminal after adding the key

**Error: "Module not found"**
- Run `npm install <package-name>` for your chosen method

**Images look wrong**
- Adjust the prompt in the script
- Try different quality settings
- Generate multiple variations and pick the best

## 📚 More Info

See `IMAGE_GENERATION_GUIDE.md` in the root directory for detailed instructions.

