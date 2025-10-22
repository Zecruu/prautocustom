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

const Replicate = require('replicate');

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const rims = [
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

const baseCarDescription = "black Mercedes G-Wagon G-Class SUV";
const viewAngle = "side profile view at 45 degree angle";
const lighting = "professional studio lighting";
const background = "light gray gradient studio background";
const cameraAngle = "eye level, centered, showing wheels clearly";

async function generateImages() {
  console.log('🎨 Regenerating rims 2, 3, 4 with black G-Wagon...\n');

  for (const rim of rims) {
    console.log(`📸 Generating: ${rim.id}...`);
    
    try {
      const output = await replicate.run(
        "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
        {
          input: {
            prompt: `Professional automotive photography, ${baseCarDescription} with ${rim.description}, ${viewAngle}, ${cameraAngle}, ${lighting}, ${background}, high quality, photorealistic, detailed wheels clearly visible, sharp focus, 8k resolution, ${rim.style}, luxury SUV, Mercedes G-Class`,
            negative_prompt: "blurry, low quality, distorted, deformed wheels, multiple cars, text, watermark, bad anatomy, sports car, sedan, coupe, front view only, rear view, wheels hidden, wheels not visible, obscured wheels",
            width: 1024,
            height: 768,
            num_outputs: 1,
            scheduler: "K_EULER",
            num_inference_steps: 50,
            guidance_scale: 7.5,
          }
        }
      );

      const response = await fetch(output[0]);
      const buffer = await response.arrayBuffer();
      const outputPath = path.join(__dirname, '../public/generated', `car-${rim.id}.png`);
      fs.writeFileSync(outputPath, Buffer.from(buffer));
      
      console.log(`✅ Saved: car-${rim.id}.png\n`);
    } catch (error) {
      console.error(`❌ Error generating ${rim.id}:`, error.message);
    }
  }

  console.log('🎉 All images regenerated successfully!');
}

generateImages().catch(console.error);

