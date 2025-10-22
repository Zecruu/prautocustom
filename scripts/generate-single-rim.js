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

const baseCarDescription = "sleek gray sports car";
const viewAngle = "3/4 front view";
const lighting = "professional studio lighting";
const background = "black background";

async function generateRim1() {
  console.log('📸 Generating rim-1...\n');
  
  const rim = {
    id: 'rim-1',
    description: 'chrome silver multi-spoke wheels with polished finish',
    style: 'classic and elegant with detailed spokes'
  };

  try {
    const output = await replicate.run(
      "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      {
        input: {
          prompt: `Professional automotive photography of a ${baseCarDescription} with ${rim.description}, ${viewAngle}, ${lighting}, ${background}, high quality, detailed wheels, sharp focus, 8k resolution, ${rim.style}`,
          negative_prompt: "blurry, low quality, distorted, deformed wheels, multiple cars, text, watermark, bad anatomy",
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
    console.log('🎉 Rim-1 generated successfully!');
  } catch (error) {
    console.error(`❌ Error generating ${rim.id}:`, error.message);
  }
}

generateRim1().catch(console.error);

