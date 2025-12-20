const fs = require('fs');
const path = require('path');

const TEAMS_DIR = path.join(__dirname, '..', 'public', 'teams');
const TEAM_JSON_PATH = path.join(__dirname, '..', 'src', 'assets', 'data', 'team.json');

console.log('🔍 Validating team images...\n');

// Read team.json
const teamData = JSON.parse(fs.readFileSync(TEAM_JSON_PATH, 'utf-8'));

// Get all image files in teams directory
const actualFiles = fs.readdirSync(TEAMS_DIR);
// const actualImagesSet = new Set(actualFiles.map(f => f.toLowerCase()));

console.log(`📁 Found ${actualFiles.length} files in /teams directory\n`);

let errors = 0;
const missingImages = [];
const fixes = [];

// Check each team member's photo
teamData.forEach((member, index) => {
  if (!member.photo) {
    console.log(`⚠️  ${member.name} - No photo specified`);
    errors++;
    return;
  }

  // Extract filename from path
  const photoPath = member.photo.replace('/teams/', '');
  const photoPathLower = photoPath.toLowerCase();

  // Check if file exists (case-insensitive check)
  const exactMatch = actualFiles.find(f => f === photoPath);
  const caseInsensitiveMatch = actualFiles.find(f => f.toLowerCase() === photoPathLower);

  if (!exactMatch) {
    if (caseInsensitiveMatch) {
      console.log(`❌ Case mismatch for ${member.name}:`);
      console.log(`   JSON: /teams/${photoPath}`);
      console.log(`   File: /teams/${caseInsensitiveMatch}`);
      fixes.push({
        member: member.name,
        oldPath: `/teams/${photoPath}`,
        correctPath: `/teams/${caseInsensitiveMatch}`
      });
      errors++;
    } else {
      console.log(`❌ Missing file for ${member.name}: ${member.photo}`);
      missingImages.push({
        member: member.name,
        photo: member.photo
      });
      errors++;
    }
  } else {
    console.log(`✅ ${member.name} - OK`);
  }
});

console.log('\n' + '='.repeat(60));
console.log(`\n📊 Validation Results:`);
console.log(`   Total members: ${teamData.length}`);
console.log(`   Errors found: ${errors}`);

if (fixes.length > 0) {
  console.log('\n🔧 Case Sensitivity Fixes Needed:');
  fixes.forEach(fix => {
    console.log(`\n   ${fix.member}:`);
    console.log(`   Change: "${fix.oldPath}"`);
    console.log(`   To:     "${fix.correctPath}"`);
  });
}

if (missingImages.length > 0) {
  console.log('\n❌ Missing Images:');
  missingImages.forEach(item => {
    console.log(`   ${item.member}: ${item.photo}`);
  });
}

if (errors === 0) {
  console.log('\n✅ All team images validated successfully!');
} else {
  console.log(`\n⚠️  Found ${errors} issue(s) that need to be fixed.`);
  console.log('\nTo auto-fix case sensitivity issues, run:');
  console.log('node scripts/fix-team-image-paths.js');
}

process.exit(errors > 0 ? 1 : 0);
