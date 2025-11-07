/**
 * Image Generation Script for PR Auto Custom
 *
 * This script generates car images with different rims using AI.
 * Choose your preferred method by uncommenting the relevant section.
 */

const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
const envPath = path.join(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=:#]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      if (key && value) {
        process.env[key] = value;
      }
    }
  });
}

// Rim configurations matching src/lib/rimData.ts
const rims = [
  {
    id: 'rim-1',
    description: 'chrome silver multi-spoke wheels with polished finish',
    style: 'classic and elegant with detailed spokes'
  },
  {
    id: 'rim-2',
    description: 'matte black mesh sport wheels with deep concave design',
    style: 'aggressive and sporty with mesh pattern'
  },
  {
    id: 'rim-3',
    description: 'silver split-spoke luxury wheels with modern styling',
    style: 'premium and sophisticated with split-spoke design'
  },
  {
    id: 'rim-4',
    description: 'gunmetal gray racing wheels with bold performance design',
    style: 'racing and dynamic with gunmetal finish'
  },
];

// Base car description (customize this to match your brand)
const baseCarDescription = "black Mercedes G-Wagon G-Class SUV";
const viewAngle = "3/4 rear angle view from driver side";
const lighting = "professional studio lighting with soft shadows";
const background = "white to gray gradient studio background";
const cameraAngle = "eye level, wheels clearly visible, centered composition";
const style = "photorealistic automotive photography, high detail on wheels";

// ============================================================================
// METHOD 1: OPENAI DALL-E 3
// ============================================================================

async function generateWithDallE() {
  const OpenAI = require('openai');
  
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  console.log('🎨 Generating images with DALL-E 3...\n');

  for (const rim of rims) {
    console.log(`📸 Generating: ${rim.id}...`);
    
    try {
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: `Professional automotive photography of a ${baseCarDescription} with ${rim.description}, ${viewAngle}, ${lighting}, ${background}, high quality, detailed wheels, photorealistic, ${rim.style}`,
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
      
      console.log(`✅ Saved: car-${rim.id}.png\n`);
    } catch (error) {
      console.error(`❌ Error generating ${rim.id}:`, error.message);
    }
  }

  console.log('🎉 All images generated successfully!');
}

// ============================================================================
// METHOD 2: FAL.AI (FASTEST)
// ============================================================================

async function generateWithFal() {
  const fal = require("@fal-ai/serverless-client");
  
  fal.config({
    credentials: process.env.FAL_KEY,
  });

  console.log('🎨 Generating images with Fal.ai Flux...\n');

  for (const rim of rims) {
    console.log(`📸 Generating: ${rim.id}...`);
    
    try {
      const result = await fal.subscribe("fal-ai/flux/dev", {
        input: {
          prompt: `Professional automotive photography of a ${baseCarDescription} with ${rim.description}, ${viewAngle}, ${lighting}, ${background}, high quality, detailed wheels, sharp focus, ${rim.style}`,
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
      
      console.log(`✅ Saved: car-${rim.id}.png\n`);
    } catch (error) {
      console.error(`❌ Error generating ${rim.id}:`, error.message);
    }
  }

  console.log('🎉 All images generated successfully!');
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function main() {
  // Create output directory if it doesn't exist
  const outputDir = path.join(__dirname, '../public/generated');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Auto-detect which API key is available and use that method
  if (process.env.OPENAI_API_KEY) {
    console.log('🔑 Using OpenAI DALL-E 3...\n');
    await generateWithDallE();
  } else if (process.env.FAL_KEY) {
    console.log('🔑 Using Fal.ai...\n');
    await generateWithFal();
  }
}

// Check for API key
if (!process.env.OPENAI_API_KEY && !process.env.FAL_KEY) {
  console.error('\n❌ ERROR: No API key found!');
  console.log('\nPlease create a .env.local file with one of these:');
  console.log('  OPENAI_API_KEY=your_key_here');
  console.log('  FAL_KEY=your_key_here\n');
  process.exit(1);
}

// Run the script
main().catch(console.error);

