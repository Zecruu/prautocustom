const sharp = require('sharp');
const path = require('path');

async function createLogo150() {
  const inputPath = path.join(__dirname, '../public/logos/Logo Blanco.png');
  const outputPath = path.join(__dirname, '../public/logos/logo-150x150.png');

  try {
    await sharp(inputPath)
      .resize(150, 150, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(outputPath);

    console.log('✅ Created 150x150px logo at:', outputPath);
  } catch (error) {
    console.error('❌ Error creating logo:', error);
  }
}

createLogo150();

