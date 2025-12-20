const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const TEAMS_DIR = path.join(__dirname, '..', 'public', 'teams');
const TEAM_JSON_PATH = path.join(__dirname, '..', 'src', 'assets', 'data', 'team.json');
const QUALITY = 80;

// Mapping of old filenames to new filenames (spaces replaced with dashes)
const renameMap = new Map();

async function processTeamImages() {
  console.log('🔄 Starting team images processing...\n');

  // Step 1: Get all image files
  const files = fs.readdirSync(TEAMS_DIR);
  const imageFiles = files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.heic'].includes(ext);
  });

  console.log(`📁 Found ${imageFiles.length} images to process\n`);

  let converted = 0;
  let renamed = 0;
  let errors = 0;

  // Step 2: Process each image
  for (const file of imageFiles) {
    try {
      const oldPath = path.join(TEAMS_DIR, file);
      const ext = path.extname(file);
      const baseName = path.basename(file, ext);
      
      // Replace spaces with dashes in the base name
      const newBaseName = baseName.replace(/\s+/g, '-');
      const newFileName = `${newBaseName}.webp`;
      const newPath = path.join(TEAMS_DIR, newFileName);

      // Track the rename mapping for team.json update
      if (file !== newFileName) {
        renameMap.set(`/teams/${file}`, `/teams/${newFileName}`);
      }

      // Convert to WebP
      console.log(`🔄 Converting: ${file} → ${newFileName}`);
      await sharp(oldPath)
        .webp({ quality: QUALITY })
        .toFile(newPath);

      console.log(`✅ Converted: ${newFileName}`);
      converted++;

      if (file !== newFileName) {
        renamed++;
      }

    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
      errors++;
    }
  }

  // Step 3: Update team.json
  console.log('\n📝 Updating team.json references...');
  await updateTeamJson();

  // Step 4: Summary
  console.log('\n' + '='.repeat(50));
  console.log('✅ Processing Complete!');
  console.log(`   Converted: ${converted} files`);
  console.log(`   Renamed: ${renamed} files (spaces → dashes)`);
  console.log(`   Errors: ${errors} files`);
  console.log('='.repeat(50));
  console.log('\n⚠️  Manual step: Delete old .jpg/.jpeg/.png files after verifying WebP files work correctly.');
}

async function updateTeamJson() {
  try {
    const teamData = JSON.parse(fs.readFileSync(TEAM_JSON_PATH, 'utf8'));
    let updatedCount = 0;

    // Update photo paths in team.json
    for (const member of teamData) {
      if (member.photo && renameMap.has(member.photo)) {
        const oldPhoto = member.photo;
        member.photo = renameMap.get(oldPhoto);
        console.log(`   Updated: ${oldPhoto} → ${member.photo}`);
        updatedCount++;
      } else if (member.photo) {
        // Change extension to .webp if not already
        const ext = path.extname(member.photo);
        if (ext !== '.webp') {
          const newPhoto = member.photo.replace(/\.(jpg|jpeg|png|heic)$/i, '.webp');
          // Also replace spaces with dashes
          member.photo = newPhoto.replace(/\s+/g, '-');
          console.log(`   Updated: ${member.photo}`);
          updatedCount++;
        }
      }
    }

    // Write updated team.json
    fs.writeFileSync(TEAM_JSON_PATH, JSON.stringify(teamData, null, 2));
    console.log(`✅ Updated ${updatedCount} photo paths in team.json`);

  } catch (error) {
    console.error('❌ Error updating team.json:', error.message);
  }
}

// Run the script
processTeamImages().catch(console.error);
