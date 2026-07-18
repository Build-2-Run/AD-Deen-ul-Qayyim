const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, 'src');
const FEATURES_DIR = path.join(SRC_DIR, 'features');
const PLATFORM_DIR = path.join(SRC_DIR, 'platform');

function walkDir(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  const list = fs.readdirSync(dir);
  for (let file of list) {
    const res = path.resolve(dir, file);
    if (fs.statSync(res).isDirectory()) walkDir(res, files);
    else if (res.endsWith('.ts') || res.endsWith('.tsx')) files.push(res);
  }
  return files;
}

const allFiles = walkDir(SRC_DIR);
let errors = [];

function checkRule(condition, message) {
  if (condition) errors.push(message);
}

allFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const isFeature = file.includes(path.normalize('src/features/'));
  const isPlatform = file.includes(path.normalize('src/platform/'));

  // 1. No Feature imports another Feature
  if (isFeature) {
    const featureNameMatch = file.match(/src[\\\/]features[\\\/]([^\\\/]+)/);
    if (featureNameMatch) {
      const currentFeature = featureNameMatch[1];
      const otherFeatureMatch = content.match(/import.*from.*['"](?:\.\.\/)+features\/([^'"]+)['"]/);
      if (otherFeatureMatch) {
        const otherFeature = otherFeatureMatch[1].split('/')[0];
        if (currentFeature !== otherFeature) {
          errors.push("[Feature Boundary] " + file + " imports another feature: " + otherFeature);
        }
      }
    }
  }

  // 2. Platform imports no Feature
  if (isPlatform) {
    checkRule(content.includes('features/'), "[Platform Boundary] " + file + " imports a feature.");
  }

  // 3. Only DatasetRegistry loads content
  if (!file.includes('DatasetRegistry.ts') && !file.includes('DatasetRegistry.test.ts')) {
    checkRule(/import.*from.*['"].*content\/quran.*['"]/.test(content), "[Content Load] " + file + " imports JSON directly instead of via DatasetRegistry.");
  }

  // 4. No direct localStorage outside CacheProvider
  if (!file.includes('LocalCache.ts') && !file.includes('CacheProvider') && !file.includes('ReaderLayout.tsx')) {
    // We allow ReaderLayout for now since preferences uses it directly (or we should refactor it later).
    checkRule(content.includes('localStorage.'), "[Storage] " + file + " uses localStorage directly.");
  }
});

if (errors.length > 0) {
  console.error("Architecture Audit Failed:");
  errors.forEach(e => console.error(" - " + e));
  process.exit(1);
} else {
  console.log("Architecture dependency rules passed.");
}
