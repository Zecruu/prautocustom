const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function createFavicon() {
  const inputPath = path.join(__dirname, '../public/logos/logo.png');
  const outputIcoPath = path.join(__dirname, '../src/app/favicon.ico');
  const output16Path = path.join(__dirname, '../public/favicon-16x16.png');
  const output32Path = path.join(__dirname, '../public/favicon-32x32.png');
  const outputApplePath = path.join(__dirname, '../public/apple-touch-icon.png');

  try {
    console.log('🎨 Creating favicon files from logo...');

    // Create 16x16 favicon
    await sharp(inputPath)
      .resize(16, 16, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(output16Path);
    console.log('✅ Created 16x16 favicon');

    // Create 32x32 favicon
    await sharp(inputPath)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(output32Path);
    console.log('✅ Created 32x32 favicon');

    // Create Apple touch icon (180x180)
    await sharp(inputPath)
      .resize(180, 180, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(outputApplePath);
    console.log('✅ Created Apple touch icon (180x180)');

    // For .ico file, we'll use the 32x32 version and rename it
    // (Sharp doesn't support .ico format directly, but browsers accept .png as .ico)
    const icoBuffer = await sharp(inputPath)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toBuffer();
    
    fs.writeFileSync(outputIcoPath, icoBuffer);
    console.log('✅ Created favicon.ico');

    console.log('\n🎉 All favicon files created successfully!');
    console.log('Files created:');
    console.log('  - src/app/favicon.ico');
    console.log('  - public/favicon-16x16.png');
    console.log('  - public/favicon-32x32.png');
    console.log('  - public/apple-touch-icon.png');
  } catch (error) {
    console.error('❌ Error creating favicon:', error);
  }
}

createFavicon();

