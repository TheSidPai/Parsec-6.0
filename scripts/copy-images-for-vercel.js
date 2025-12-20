const fs = require('fs');
const path = require('path');

// Function to ensure directory exists
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✅ Created directory: ${dirPath}`);
  }
}

// Function to copy file
function copyFile(source, destination) {
  try {
    if (fs.existsSync(source)) {
      fs.copyFileSync(source, destination);
      console.log(`✅ Copied: ${path.basename(source)}`);
      return true;
    } else {
      console.warn(`⚠️  Source not found: ${source}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error copying ${source}:`, error.message);
    return false;
  }
}

console.log('🚀 Starting image copy process for Vercel deployment...\n');

// Paths
const srcRoot = path.join(__dirname, '..');
const publicRoot = path.join(srcRoot, 'public');

// 1. Copy gallery images from assets to public
console.log('📸 Copying gallery images...');
const gallerySourceDir = path.join(srcRoot, 'src', 'assets', 'images', 'event-images', 'FinalImages');
const galleryDestDir = path.join(publicRoot, 'gallery');

ensureDir(galleryDestDir);

const galleryImages = [
  'ABC.webp',
  'BAB.webp',
  'BAB2.webp',
  'BAB3.webp',
  'crowd.webp',
  'Event.webp',
  'Event2.webp',
  'RedAlert.webp',
  'StandUp.webp'
];

let copiedCount = 0;
galleryImages.forEach(img => {
  const source = path.join(gallerySourceDir, img);
  const dest = path.join(galleryDestDir, img);
  if (copyFile(source, dest)) {
    copiedCount++;
  }
});

console.log(`\n✨ Gallery images: ${copiedCount}/${galleryImages.length} copied successfully\n`);

// 2. Verify houses directory
console.log('🏰 Verifying houses directory...');
const housesDir = path.join(publicRoot, 'houses');
const houseImages = ['gryffindor.png', 'hufflepuff.png', 'ravenclaw.png', 'slytherin.png'];

let housesExist = 0;
houseImages.forEach(img => {
  const filePath = path.join(housesDir, img);
  if (fs.existsSync(filePath)) {
    console.log(`✅ Found: ${img}`);
    housesExist++;
  } else {
    console.warn(`⚠️  Missing: ${img}`);
  }
});

console.log(`\n✨ House images: ${housesExist}/${houseImages.length} exist\n`);

// 3. Verify event logos
console.log('🎪 Verifying event logos...');
const logosDir = path.join(publicRoot, 'events_main_img', 'LOGO');
const logoImages = [
  'bithunt_logo.jpeg',
  'devhack_logo.jpeg',
  'protocraft_logo.jpeg',
  'singularity_logo.jpeg',
  'Synapse_logo.jpeg'
];

let logosExist = 0;
logoImages.forEach(img => {
  const filePath = path.join(logosDir, img);
  if (fs.existsSync(filePath)) {
    console.log(`✅ Found: ${img}`);
    logosExist++;
  } else {
    console.warn(`⚠️  Missing: ${img}`);
  }
});

console.log(`\n✨ Event logos: ${logosExist}/${logoImages.length} exist\n`);

// 4. Verify team photos (sample check)
console.log('👥 Verifying team photos...');
const teamsDir = path.join(publicRoot, 'teams');
if (fs.existsSync(teamsDir)) {
  const teamFiles = fs.readdirSync(teamsDir).filter(f => f.endsWith('.webp'));
  console.log(`✅ Found ${teamFiles.length} team photos in /public/teams/`);
} else {
  console.warn('⚠️  Teams directory not found!');
}

console.log('\n🎉 Image verification complete!\n');
console.log('📝 Summary:');
console.log(`   Gallery: ${copiedCount}/${galleryImages.length}`);
console.log(`   Houses: ${housesExist}/${houseImages.length}`);
console.log(`   Event Logos: ${logosExist}/${logoImages.length}`);
console.log('\n💡 Important for Vercel:');
console.log('   1. All images in /public are accessible at root URL (/)');
console.log('   2. Paths must use forward slashes: /teams/image.webp');
console.log('   3. File names are case-sensitive on Linux/Vercel');
console.log('   4. No spaces in filenames - use dashes or underscores\n');
