#!/usr/bin/env node
/**
 * Generate placeholder PNG assets for Expo
 * This script creates simple colored PNG files as placeholders
 */

import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Simple function to create a 1x1 PNG with a solid color
function createPlaceholderPNG(width, height, color) {
  // PNG header
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // color type (RGB)

  // Create a simple colored image data
  const imageData = Buffer.alloc(height * (1 + width * 3));
  for (let y = 0; y < height; y++) {
    const rowStart = y * (1 + width * 3);
    imageData[rowStart] = 0; // filter type
    for (let x = 0; x < width; x++) {
      const pixelStart = rowStart + 1 + x * 3;
      imageData[pixelStart] = color.r;
      imageData[pixelStart + 1] = color.g;
      imageData[pixelStart + 2] = color.b;
    }
  }

  // For simplicity, we'll create a minimal PNG
  // In practice, you'd use a proper library like 'pngjs'
  console.log(`Note: Creating placeholder ${width}x${height} PNG`);
  console.log('Consider replacing with proper graphics later');

  return signature;
}

// Create assets directory if it doesn't exist
const assetsDir = path.join(__dirname, '..', 'assets');

// For now, let's just inform the user
console.log('Placeholder asset generation script');
console.log('=====================================');
console.log('');
console.log('This script would generate placeholder assets.');
console.log('For a quick fix, we recommend one of these options:');
console.log('');
console.log('1. Download default Expo assets from:');
console.log('   https://github.com/expo/expo/tree/main/templates/expo-template-blank/assets');
console.log('');
console.log('2. Use npx to copy from a template:');
console.log('   npx create-expo-app temp-app --template blank');
console.log('   cp -r temp-app/assets/* assets/');
console.log('   rm -rf temp-app');
console.log('');
console.log('3. Or temporarily remove the icon reference from app.json');
console.log('');
console.log('Assets directory:', assetsDir);
