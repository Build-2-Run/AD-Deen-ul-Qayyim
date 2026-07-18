const fs = require('fs');
const path = require('path');

function walk(d) {
  let r = [];
  fs.readdirSync(d).forEach(f => {
    let p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) r = r.concat(walk(p));
    else r.push(p);
  });
  return r;
}

const files = walk('./src').filter(f => f.endsWith('.ts') || f.endsWith('.tsx'));

let errors = [];

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  
  if (f.includes(path.normalize('src/platform/')) && content.includes('features/')) {
    errors.push('[Violation] Platform module imports Feature module: ' + f);
  }

  if (f.includes(path.normalize('src/features/quran/')) && content.includes('features/hadith')) {
    errors.push('[Violation] Quran imports Hadith: ' + f);
  }
  
  if (f.includes(path.normalize('src/platform/events/EventBus.ts')) && content.includes('engines/')) {
    errors.push('[Violation] EventBus imports Engines directly (Cyclical Dep): ' + f);
  }
});

if (errors.length > 0) {
  console.error("Architecture Violations Found:");
  errors.forEach(e => console.error(e));
  process.exit(1);
} else {
  console.log("Architecture dependency rules passed.");
}
