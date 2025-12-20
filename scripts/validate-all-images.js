const fs = require('fs');
const path = require('path');

console.log('🔍 Validating ALL images for Linux/Vercel compatibility...\n');

let totalErrors = 0;

// ========== 1. VALIDATE HOUSES ========== 
console.log('📁 Checking /houses/ images...');
const HOUSES_DIR = path.join(__dirname, '..', 'public', 'houses');
const expectedHouses = ['gryffindor.png', 'hufflepuff.png', 'ravenclaw.png', 'slytherin.png'];

if (fs.existsSync(HOUSES_DIR)) {
  const houseFiles = fs.readdirSync(HOUSES_DIR);
  expectedHouses.forEach(house => {
    if (houseFiles.includes(house)) {
      console.log(`  ✅ /houses/${house}`);
    } else {
      console.log(`  ❌ Missing: /houses/${house}`);
      totalErrors++;
    }
  });
} else {
  console.log('  ❌ /houses/ directory not found!');
  totalErrors++;
}

// ========== 2. VALIDATE TEAMS ========== 
console.log('\n📁 Checking /teams/ images...');
const TEAMS_DIR = path.join(__dirname, '..', 'public', 'teams');
const TEAM_JSON_PATH = path.join(__dirname, '..', 'src', 'assets', 'data', 'team.json');

if (fs.existsSync(TEAM_JSON_PATH)) {
  const teamData = JSON.parse(fs.readFileSync(TEAM_JSON_PATH, 'utf-8'));
  const actualFiles = fs.readdirSync(TEAMS_DIR);
  
  teamData.forEach(member => {
    if (!member.photo) {
      console.log(`  ⚠️  ${member.name} - No photo`);
      return;
    }
    
    const photoPath = member.photo.replace('/teams/', '');
    if (actualFiles.includes(photoPath)) {
      console.log(`  ✅ ${member.name}: ${photoPath}`);
    } else {
      console.log(`  ❌ ${member.name}: ${photoPath} NOT FOUND`);
      totalErrors++;
    }
  });
} else {
  console.log('  ❌ team.json not found!');
  totalErrors++;
}

// ========== 3. VALIDATE SORTING IMAGE ========== 
console.log('\n📁 Checking /sorting_img/ ...');
const SORTING_DIR = path.join(__dirname, '..', 'public', 'sorting_img');
const expectedSortingImg = 'sorting-background.jpg';

if (fs.existsSync(SORTING_DIR)) {
  const sortingFiles = fs.readdirSync(SORTING_DIR);
  if (sortingFiles.includes(expectedSortingImg)) {
    console.log(`  ✅ /sorting_img/${expectedSortingImg}`);
  } else {
    console.log(`  ❌ Missing: ${expectedSortingImg}`);
    console.log(`  📂 Found: ${sortingFiles.join(', ')}`);
    totalErrors++;
  }
} else {
  console.log('  ❌ /sorting_img/ directory not found!');
  totalErrors++;
}

// ========== 4. VALIDATE ASSETS IMAGES ========== 
console.log('\n📁 Checking /src/assets/images/ ...');
const ASSETS_DIR = path.join(__dirname, '..', 'src', 'assets', 'images');
const expectedAssets = ['parchment.webp', 'onboarding.webp'];

if (fs.existsSync(ASSETS_DIR)) {
  expectedAssets.forEach(asset => {
    const assetPath = path.join(ASSETS_DIR, asset);
    if (fs.existsSync(assetPath)) {
      console.log(`  ✅ ${asset}`);
    } else {
      console.log(`  ❌ Missing: ${asset}`);
      totalErrors++;
    }
  });
} else {
  console.log('  ❌ /src/assets/images/ directory not found!');
  totalErrors++;
}

// ========== 5. CHECK CSS PATHS ========== 
console.log('\n📝 Checking CSS image paths...');

const cssFiles = [
  { file: 'src/pages/signup/SortingHat.css', expected: '../../../public/sorting_img/sorting-background.jpg' },
  { file: 'src/pages/signup/Onboarding.css', expected: '../../assets/images/onboarding.webp' },
  { file: 'src/pages/Schedule.css', expected: '../assets/images/parchment.webp' },
  { file: 'src/pages/ScheduleB.css', expected: '../assets/images/parchment.webp' },
  { file: 'src/pages/dashboard/DashboardSchedule.css', expected: '../../assets/images/parchment.webp' },
  { file: 'src/components/EventCard2.css', expected: '../assets/images/parchment.webp' },
];

cssFiles.forEach(({ file, expected }) => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8');
    if (content.includes(expected)) {
      console.log(`  ✅ ${file}`);
    } else {
      console.log(`  ⚠️  ${file} - Path might be incorrect`);
      console.log(`     Expected: ${expected}`);
    }
  }
});

// ========== SUMMARY ========== 
console.log('\n' + '='.repeat(60));
console.log('\n📊 Validation Summary:');
console.log(`   Total errors: ${totalErrors}`);

if (totalErrors === 0) {
  console.log('\n✅ All images validated successfully!');
  console.log('   Your images will work on Vercel/Linux servers.');
} else {
  console.log(`\n⚠️  Found ${totalErrors} issue(s) that need to be fixed.`);
  console.log('   Fix these before deploying to Vercel.');
}

console.log('\n💡 Remember:');
console.log('   - Linux is case-sensitive (gryffindor.png ≠ Gryffindor.png)');
console.log('   - Use URL encoding for spaces in CSS (%20)');
console.log('   - Run this script before every deployment');

process.exit(totalErrors > 0 ? 1 : 0);
