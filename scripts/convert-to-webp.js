const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuration
const QUALITY = 80; // WebP quality (0-100)
const DELETE_ORIGINALS = false; // Set to true to delete original files after conversion
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.avif', '.JPG', '.JPEG', '.PNG', '.AVIF'];

const convertToWebP = async (inputPath, outputPath) => {
  try {
    await sharp(inputPath)
      .webp({ quality: QUALITY })
      .toFile(outputPath);
    return true;
  } catch (error) {
    console.error(`Error converting ${inputPath}:`, error.message);
    return false;
  }
};

const processDirectory = async (dir) => {
  let converted = 0;
  let skipped = 0;
  let errors = 0;

  const processRecursive = async (currentDir) => {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Recursively process subdirectories
        await processRecursive(fullPath);
      } else {
        const ext = path.extname(item);
        
        // Check if it's an image file that needs conversion
        if (IMAGE_EXTENSIONS.includes(ext)) {
          const outputPath = fullPath.replace(new RegExp(`${ext}$`, 'i'), '.webp');
          
          // Skip if webp already exists
          if (fs.existsSync(outputPath)) {
            console.log(`⏭️  Skipped (already exists): ${path.relative(dir, fullPath)}`);
            skipped++;
            continue;
          }
          
          console.log(`🔄 Converting: ${path.relative(dir, fullPath)}`);
          const success = await convertToWebP(fullPath, outputPath);
          
          if (success) {
            console.log(`✅ Converted: ${path.relative(dir, outputPath)}`);
            converted++;
            
            // Optionally delete original file
            if (DELETE_ORIGINALS) {
              fs.unlinkSync(fullPath);
              console.log(`🗑️  Deleted original: ${path.relative(dir, fullPath)}`);
            }
          } else {
            errors++;
          }
        }
      }
    }
  };

  await processRecursive(dir);
  
  return { converted, skipped, errors };
};

// Main execution
const main = async () => {
  const assetsPath = path.join(__dirname, '..', 'src', 'assets', 'images');
  
  console.log('🚀 Starting WebP conversion...');
  console.log(`📁 Processing directory: ${assetsPath}`);
  console.log(`⚙️  Quality: ${QUALITY}%`);
  console.log(`🗑️  Delete originals: ${DELETE_ORIGINALS ? 'YES' : 'NO'}`);
  console.log('─'.repeat(60));
  
  if (!fs.existsSync(assetsPath)) {
    console.error(`❌ Directory not found: ${assetsPath}`);
    process.exit(1);
  }
  
  const { converted, skipped, errors } = await processDirectory(assetsPath);
  
  console.log('─'.repeat(60));
  console.log('✨ Conversion complete!');
  console.log(`✅ Converted: ${converted} files`);
  console.log(`⏭️  Skipped: ${skipped} files`);
  console.log(`❌ Errors: ${errors} files`);
};

main();
