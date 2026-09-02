const sharp = require('sharp');

async function generate() {
  await sharp('public/icon.svg')
    .resize(192, 192)
    .toFile('public/icon-192.png');
  await sharp('public/icon.svg')
    .resize(512, 512)
    .toFile('public/icon-512.png');
  await sharp('public/icon.svg')
    .resize(48, 48)
    .toFile('public/favicon.ico'); // Just a png renamed for fallback if needed, but we'll use png properly
  console.log('Icons generated successfully.');
}

generate().catch(console.error);
