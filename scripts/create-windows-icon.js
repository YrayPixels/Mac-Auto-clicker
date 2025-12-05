#!/usr/bin/env node

/**
 * Helper script to create Windows icon (.ico) from PNG
 * 
 * Usage:
 *   node scripts/create-windows-icon.js path/to/icon.png
 * 
 * Requirements:
 *   - ImageMagick installed (brew install imagemagick)
 *   - Or use online converter if ImageMagick not available
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const inputFile = process.argv[2];
const outputFile = path.join(__dirname, '..', 'build', 'icon.ico');

if (!inputFile) {
  console.error('Usage: node scripts/create-windows-icon.js <path-to-png-file>');
  console.error('');
  console.error('Example:');
  console.error('  node scripts/create-windows-icon.js icon-256.png');
  process.exit(1);
}

if (!fs.existsSync(inputFile)) {
  console.error(`Error: File not found: ${inputFile}`);
  process.exit(1);
}

// Check if ImageMagick is available
try {
  execSync('magick -version', { stdio: 'ignore' });
  
  console.log('Creating Windows icon using ImageMagick...');
  console.log(`Input: ${inputFile}`);
  console.log(`Output: ${outputFile}`);
  
  // Create build directory if it doesn't exist
  const buildDir = path.dirname(outputFile);
  if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir, { recursive: true });
  }
  
  // Create ICO with multiple sizes
  execSync(
    `magick convert "${inputFile}" -define icon:auto-resize=256,128,64,48,32,16 "${outputFile}"`,
    { stdio: 'inherit' }
  );
  
  console.log(`\n✅ Success! Windows icon created at: ${outputFile}`);
  console.log('\nYou can now build for Windows using:');
  console.log('  npm run dist:win');
  
} catch (error) {
  if (error.message.includes('magick')) {
    console.error('❌ ImageMagick not found!');
    console.error('');
    console.error('Please install ImageMagick:');
    console.error('  macOS: brew install imagemagick');
    console.error('  Windows: Download from https://imagemagick.org/script/download.php');
    console.error('  Linux: sudo apt-get install imagemagick');
    console.error('');
    console.error('Alternatively, use an online converter:');
    console.error('  https://convertio.co/png-ico/');
    console.error('  https://icoconvert.com/');
    console.error('');
    console.error('Upload your PNG file and save the .ico as: build/icon.ico');
  } else {
    console.error('Error creating icon:', error.message);
  }
  process.exit(1);
}

