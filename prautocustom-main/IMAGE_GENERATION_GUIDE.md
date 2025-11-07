# 🎨 Image Generation Guide for PR Auto Custom

This guide will help you generate the pre-rendered car images with different rims for the visualizer.

## 📁 Required Directory Structure

Create the following directories in your `public` folder:

```
public/
├── generated/          # Pre-generated car images with rims
│   ├── car-classic-chrome.png
│   ├── car-sport-black.png
│   ├── car-luxury-gold.png
│   ├── car-racing-red.png
│   ├── car-modern-white.png
│   └── car-titanium-gray.png
└── rims/              # Individual rim thumbnails (optional)
    ├── classic-chrome.png
    ├── sport-black.png
    ├── luxury-gold.png
    ├── racing-red.png
    ├── modern-white.png
    └── titanium-gray.png
```

---

## 🚀 Method 1: Using Replicate API (Recommended)

### Setup

1. Sign up at [Replicate.com](https://replicate.com)
2. Get your API token
3. Install the Replicate client:

```bash
npm install replicate
```

### Generate Images Script

Create a file `scripts/generate-rim-images.js`:

```javascript
const Replicate = require('replicate');
const fs = require('fs');
const path = require('path');

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const rims = [
  { id: 'classic-chrome', description: 'chrome silver wheels' },
  { id: 'sport-black', description: 'matte black sport wheels' },
  { id: 'luxury-gold', description: 'gold luxury wheels' },
  { id: 'racing-red', description: 'candy red racing wheels' },
  { id: 'modern-white', description: 'pearl white modern wheels' },
  { id: 'titanium-gray', description: 'titanium gray premium wheels' },
];

async function generateImages() {
  for (const rim of rims) {
    console.log(`Generating image for ${rim.id}...`);
    
    const output = await replicate.run(
      "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      {
        input: {
          prompt: `Professional photo of a sleek gray sports car with ${rim.description}, studio lighting, 3/4 front view, high quality, automotive photography, black background`,
          negative_prompt: "blurry, low quality, distorted, deformed wheels, multiple cars",
          width: 1024,
          height: 768,
          num_outputs: 1,
        }
      }
    );

    // Download and save the image
    const response = await fetch(output[0]);
    const buffer = await response.arrayBuffer();
    const outputPath = path.join(__dirname, '../public/generated', `car-${rim.id}.png`);
    fs.writeFileSync(outputPath, Buffer.from(buffer));
    
    console.log(`✓ Saved: car-${rim.id}.png`);
  }
}

generateImages().catch(console.error);
```

Run it:
```bash
REPLICATE_API_TOKEN=your_token node scripts/generate-rim-images.js
```

---

## 🎨 Method 2: Using DALL-E 3 (OpenAI)

### Setup

```bash
npm install openai
```

### Generate Images Script

Create `scripts/generate-with-dalle.js`:

```javascript
const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const rims = [
  { id: 'classic-chrome', description: 'chrome silver wheels' },
  { id: 'sport-black', description: 'matte black sport wheels' },
  { id: 'luxury-gold', description: 'gold luxury wheels' },
  { id: 'racing-red', description: 'candy red racing wheels' },
  { id: 'modern-white', description: 'pearl white modern wheels' },
  { id: 'titanium-gray', description: 'titanium gray premium wheels' },
];

async function generateImages() {
  for (const rim of rims) {
    console.log(`Generating image for ${rim.id}...`);
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Professional automotive photography of a sleek gray sports car with ${rim.description}, 3/4 front view, studio lighting, black background, high quality, detailed wheels`,
      size: "1024x1024",
      quality: "hd",
      n: 1,
    });

    const imageUrl = response.data[0].url;
    
    // Download and save
    const imageResponse = await fetch(imageUrl);
    const buffer = await imageResponse.arrayBuffer();
    const outputPath = path.join(__dirname, '../public/generated', `car-${rim.id}.png`);
    fs.writeFileSync(outputPath, Buffer.from(buffer));
    
    console.log(`✓ Saved: car-${rim.id}.png`);
  }
}

generateImages().catch(console.error);
```

Run it:
```bash
OPENAI_API_KEY=your_key node scripts/generate-with-dalle.js
```

---

## 🖼️ Method 3: Using Photoshop/GIMP (Manual)

### Steps:

1. **Get a base car image**
   - Use your hero image or find a high-quality car photo
   - Ensure it's on a clean background

2. **For each rim style:**
   - Open the base image in Photoshop/GIMP
   - Use the selection tool to select the wheels
   - Replace with the new rim design
   - Match lighting and perspective
   - Export as PNG

3. **Save files:**
   - Save each variation as `car-{rim-id}.png` in `public/generated/`

---

## 🤖 Method 4: Using Fal.ai (Fastest & Cheapest)

### Setup

```bash
npm install @fal-ai/serverless-client
```

### Generate Images Script

Create `scripts/generate-with-fal.js`:

```javascript
const fal = require("@fal-ai/serverless-client");
const fs = require('fs');
const path = require('path');

fal.config({
  credentials: process.env.FAL_KEY,
});

const rims = [
  { id: 'classic-chrome', description: 'chrome silver wheels' },
  { id: 'sport-black', description: 'matte black sport wheels' },
  { id: 'luxury-gold', description: 'gold luxury wheels' },
  { id: 'racing-red', description: 'candy red racing wheels' },
  { id: 'modern-white', description: 'pearl white modern wheels' },
  { id: 'titanium-gray', description: 'titanium gray premium wheels' },
];

async function generateImages() {
  for (const rim of rims) {
    console.log(`Generating image for ${rim.id}...`);
    
    const result = await fal.subscribe("fal-ai/flux/dev", {
      input: {
        prompt: `Professional photo of a sleek gray sports car with ${rim.description}, studio lighting, 3/4 front view, high quality, automotive photography, black background`,
        image_size: "landscape_16_9",
        num_inference_steps: 28,
        guidance_scale: 3.5,
      },
    });

    // Download and save
    const imageUrl = result.images[0].url;
    const response = await fetch(imageUrl);
    const buffer = await response.arrayBuffer();
    const outputPath = path.join(__dirname, '../public/generated', `car-${rim.id}.png`);
    fs.writeFileSync(outputPath, Buffer.from(buffer));
    
    console.log(`✓ Saved: car-${rim.id}.png`);
  }
}

generateImages().catch(console.error);
```

---

## 📝 Prompt Engineering Tips

For best results, use prompts like:

```
Professional automotive photography of a [car color] [car type] with [rim description], 
3/4 front view, studio lighting, black background, high quality, 
detailed wheels, sharp focus, 8k resolution
```

### Examples:

- **Classic Chrome**: "sleek gray sports car with chrome silver wheels"
- **Sport Black**: "aggressive gray sports car with matte black sport wheels"
- **Luxury Gold**: "premium gray luxury car with gold accent wheels"

---

## 🎯 Quick Start (Temporary Placeholder)

If you want to test the visualizer before generating images:

1. Copy your hero image 6 times:
```bash
mkdir -p public/generated
cp public/images/hero.png public/generated/car-classic-chrome.png
cp public/images/hero.png public/generated/car-sport-black.png
cp public/images/hero.png public/generated/car-luxury-gold.png
cp public/images/hero.png public/generated/car-racing-red.png
cp public/images/hero.png public/generated/car-modern-white.png
cp public/images/hero.png public/generated/car-titanium-gray.png
```

2. Later, replace these with AI-generated images using one of the methods above.

---

## 💰 Cost Comparison

| Method | Cost per Image | Quality | Speed |
|--------|---------------|---------|-------|
| Replicate (SDXL) | ~$0.005 | High | 3-5s |
| DALL-E 3 | $0.04 | Very High | 10-20s |
| Fal.ai (Flux) | ~$0.003 | High | 1-2s |
| Manual (Photoshop) | Free | Highest | 10-30min |

---

## 🔄 Updating Images

When you add new rims to `src/lib/rimData.ts`:

1. Add the rim data with a new `generatedImage` path
2. Run your generation script with the new rim description
3. The visualizer will automatically use the new image

---

## 📞 Need Help?

- Check the [Replicate Documentation](https://replicate.com/docs)
- Check the [OpenAI API Docs](https://platform.openai.com/docs)
- Check the [Fal.ai Documentation](https://fal.ai/docs)

