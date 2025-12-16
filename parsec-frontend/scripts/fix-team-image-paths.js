const fs = require('fs');
const path = require('path');

const TEAMS_DIR = path.join(__dirname, '..', 'public', 'teams');
const TEAM_JSON_PATH = path.join(__dirname, '..', 'src', 'assets', 'data', 'team.json');
const BACKUP_PATH = path.join(__dirname, '..', 'src', 'assets', 'data', 'team.json.backup');

console.log('🔧 Fixing team image paths...\n');

// Create backup
fs.copyFileSync(TEAM_JSON_PATH, BACKUP_PATH);
console.log(`💾 Backup created: ${BACKUP_PATH}\n`);

// Read team.json
const teamData = JSON.parse(fs.readFileSync(TEAM_JSON_PATH, 'utf-8'));

// Get all image files in teams directory
const actualFiles = fs.readdirSync(TEAMS_DIR);
const actualImagesMap = new Map();
actualFiles.forEach(f => {
  actualImagesMap.set(f.toLowerCase(), f);
});

let fixed = 0;
let notFound = 0;

// Fix each team member's photo path
teamData.forEach((member) => {
  if (!member.photo) return;

  const photoPath = member.photo.replace('/teams/', '');
  const photoPathLower = photoPath.toLowerCase();

  // Check for exact match first
  if (!actualFiles.includes(photoPath)) {
    // Try case-insensitive match
    const correctFilename = actualImagesMap.get(photoPathLower);
    
    if (correctFilename) {
      const oldPath = member.photo;
      member.photo = `/teams/${correctFilename}`;
      console.log(`✅ Fixed ${member.name}:`);
      console.log(`   From: ${oldPath}`);
      console.log(`   To:   ${member.photo}\n`);
      fixed++;
    } else {
      console.log(`❌ Could not find match for ${member.name}: ${member.photo}\n`);
      notFound++;
    }
  }
});

// Write updated team.json
fs.writeFileSync(TEAM_JSON_PATH, JSON.stringify(teamData, null, 2), 'utf-8');

console.log('='.repeat(60));
console.log(`\n📊 Fix Results:`);
console.log(`   Fixed: ${fixed}`);
console.log(`   Not found: ${notFound}`);

if (fixed > 0) {
  console.log('\n✅ team.json has been updated!');
  console.log('   Backup saved at: team.json.backup');
}

if (notFound > 0) {
  console.log('\n⚠️  Some images could not be found.');
  console.log('   Please add the missing image files to public/teams/');
}
