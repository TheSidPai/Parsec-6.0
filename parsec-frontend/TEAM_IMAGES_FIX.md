# Team Images Fix - Vercel Deployment Issue

## Problem
Team member photos were visible on localhost but not showing on Vercel deployment.

## Root Cause
**Case Sensitivity Issue**: 
- Windows/localhost file systems are case-insensitive
- Linux servers (Vercel) are case-sensitive
- Image file paths in `team.json` must EXACTLY match the actual filenames in `public/teams/`

## Solution Implemented

### 1. Created Validation Script
**File**: `scripts/validate-team-images.js`
- Checks all team member photos against actual files
- Identifies case mismatches
- Reports missing images
- Run with: `npm run validate-images`

### 2. Created Auto-Fix Script
**File**: `scripts/fix-team-image-paths.js`
- Automatically corrects case mismatches
- Creates backup before making changes
- Run with: `npm run fix-image-paths`

### 3. Fixed Missing Photo
- Added `affan_photo.webp` path for Affan P in team.json

### 4. Added Pre-build Validation
Updated `package.json` scripts:
```json
"prebuild": "node scripts/validate-team-images.js"
```
This ensures image validation runs automatically before every build.

## Verification
All 26 team members now have valid image paths:
```
✅ All team images validated successfully!
```

## How to Use

### Before Deployment
```bash
# Validate images
npm run validate-images

# Fix any issues found
npm run fix-image-paths
```

### Adding New Team Members
1. Add image to `public/teams/` folder
2. Note the EXACT filename (case-sensitive)
3. Add team member to `team.json` with exact path: `/teams/filename.webp`
4. Run `npm run validate-images` to verify

## Common Issues & Solutions

### Issue: Images work locally but not on Vercel
**Solution**: Case mismatch - run `npm run validate-images` and fix paths

### Issue: New image not showing
**Solution**: 
1. Check exact filename in `public/teams/`
2. Ensure path in `team.json` matches exactly
3. Run validation script

### Issue: Need to rename image file
**Solution**:
1. Rename file in `public/teams/`
2. Update path in `team.json`
3. Run validation to confirm

## Files Modified
- ✅ `src/assets/data/team.json` - Added missing photo for Affan P
- ✅ `scripts/validate-team-images.js` - Created validation script
- ✅ `scripts/fix-team-image-paths.js` - Created auto-fix script
- ✅ `package.json` - Added validation scripts and prebuild hook

## Next Deployment
Images will now work correctly on Vercel because:
1. All paths are validated before build
2. Case sensitivity issues are resolved
3. Missing images are identified early
